import { RESEND_AUDIENCE_ID, RESEND_TOKEN } from "astro:env/server";
import { Resend } from "resend";

export const audienceId = RESEND_AUDIENCE_ID;

export const resend = new Resend(RESEND_TOKEN);
