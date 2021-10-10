import { SetCaptchaOption, SetDecoyOption, SetTraceOption, defaultCaptchaOption, defaultDecoyOptions, defaultTraceOptions } from "./constants.ts";
import { createCanvas, Image } from "../deps.ts";
import { randomText, getRandom, getRandomCoordinate } from "./util.ts";

interface captcha {
    height: number;
    width: number;
    captcha: SetCaptchaOption;
    decoy: SetDecoyOption;
    trace: SetTraceOption;
    background?: Image;
}

export function createCaptcha(captcha: captcha = { height: 100, width: 300, captcha: defaultCaptchaOption, decoy: defaultDecoyOptions, trace: defaultTraceOptions}) {
    const canvas = createCanvas(captcha.width, captcha.height);
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = 'miter';
    ctx.textBaseline = 'middle';
    if(captcha.background) ctx.drawImage(captcha.background, 0, 0);
    const decoyOption = { ...defaultDecoyOptions, ...captcha.decoy };
    const captchaOption = { ...defaultCaptchaOption, ...captcha.captcha };
    if(captcha.captcha.text) captchaOption.characters = captcha.captcha.text.length;
    if(!captchaOption.text) captchaOption.text = randomText(captchaOption.characters);
    const traceOption = { ...defaultTraceOptions, ...captcha.trace };
    const coordinates = getRandomCoordinate(captcha.width, captcha.height, captchaOption.characters);

    if(decoyOption.opacity) {
        if(!decoyOption.total) decoyOption.total = Math.floor(captcha.width * captcha.height/10000);

        const decoyText = randomText(decoyOption.total);
        ctx.font = `${decoyOption.size}px ${decoyOption.font}`;
        ctx.globalAlpha = decoyOption.opacity;
        ctx.fillStyle = decoyOption.color;
		for(let i = 0; i < decoyText.length; i++) {
			ctx.fillText(decoyText[i], getRandom(30, captcha.width - 30), getRandom(30, captcha.height - 30));
		}
    }

    if(traceOption.opacity) {
        ctx.strokeStyle = traceOption.color;
		ctx.globalAlpha = traceOption.opacity;

		ctx.beginPath();
		ctx.moveTo(coordinates[0][0], coordinates[0][1]);
		ctx.lineWidth = traceOption.size;
		for(let i = 1; i < coordinates.length; i++) {
			ctx.lineTo(coordinates[i][0], coordinates[i][1]);
		}
		ctx.stroke();
    }

    if(captchaOption.opacity) {
        ctx.font = `${captchaOption.size}px ${captchaOption.font}`;
		ctx.globalAlpha = captchaOption.opacity;
		ctx.fillStyle = captchaOption.color;

		for(let n = 0; n < coordinates.length; n++) {
			ctx.save();
			ctx.translate(coordinates[n][0], coordinates[n][1]);
			if (captchaOption.skew) {ctx.transform(1, Math.random(), getRandom(20) / 100, 1, 0, 0);}
			if (captchaOption.rotate > 0) {ctx.rotate(getRandom(-captchaOption.rotate, captchaOption.rotate) * Math.PI / 180);}
			if (captchaOption.colors?.length > 2) {ctx.fillStyle = captchaOption.colors[getRandom(captchaOption.colors.length - 1)];}
			ctx.fillText(captchaOption.text[n], 0, 0);
			ctx.restore();
        }
    }

    return {
        text: captchaOption.text,
        image: canvas.toBuffer("image/png")
    }
}