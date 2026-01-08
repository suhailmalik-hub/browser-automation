import { NextResponse } from "next/server";
import { chromium, type Page } from "playwright";
import { formData } from "@/lib/formData";

export const runtime = "nodejs";

type Payload = {
    url?: string;
};

const fillControlById = async (page: Page, id: string, value: string) => {
    try {
        const control = page.locator(`#${id}`);
        await control.selectOption({ label: value }).catch(async () => {
            await control.selectOption({ value }).catch(async () => {
                await control.fill(value);
            });
        });
    } catch (error) {
        console.warn(`Could not fill element with id ${id}:`, error);
    }
};

const fillControl = async (page: Page, label: string, value: string) => {
    try {
        const control = page.getByLabel(label, { exact: false });
        await control.selectOption({ label: value }).catch(async () => {
            await control.selectOption({ value }).catch(async () => {
                await control.fill(value);
            });
        });
    } catch (error) {
        console.warn(`Could not fill ${label}:`, error);
    }
};

export async function POST(request: Request) {
    const body = (await request.json().catch(() => ({}))) as Payload;
    const targetUrl = body.url;

    if (!targetUrl) {
        return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }

    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
        await page.waitForLoadState("networkidle", { timeout: 90_000 }).catch(() => undefined);

        await fillControlById(page, "cognome", formData.surname);
        await fillControlById(page, "nome", formData.name);
        await fillControl(page, "Date of birth", formData.date_of_birth);
        await fillControl(page, "Place of birth", formData.place_of_birth);
        await fillControl(page, "Country of birth", formData.country_of_birth);
        await fillControl(page, "Current nationality", formData.current_nationality);
        await fillControl(page, "Sex", formData.sex);
        await fillControl(page, "Home address", formData.address);
        await fillControl(page, "Postal code", formData.postal_code);
        await fillControl(page, "City", formData.city);
        await fillControl(page, "Country", formData.country);
        await fillControl(page, "Phone", formData.phone);
        await fillControl(page, "Email", formData.email);
        await fillControl(
            page,
            "Surname of parental authority or legal guardian",
            formData.surname_of_parental_authority_or_legal_guardian,
        );
        await fillControl(
            page,
            "First name of parental authority or legal guardian",
            formData.first_name_of_parental_authority_or_legal_guardian,
        );
        await fillControl(page, "Country of issue", formData.country_of_issue);
        await fillControl(page, "Document type", formData.document_type);
        await fillControl(page, "Number of travel document", formData.number_of_travel_document);
        await fillControl(page, "Expiry date of travel document", formData.expiry_date_of_travel_document);
        await fillControl(page, "Member state of first entry", formData.member_state_of_first_entry);
        await fillControl(page, "Main purpose of the journey", formData.main_purpose_of_the_journey);
        await fillControl(page, "Member state of destination", formData.member_state_of_destination);
        await fillControl(page, "Number of entries required", formData.number_of_entries_required);
        await fillControl(
            page,
            "Duration of the intended stay or transit",
            formData.duration_of_the_intended_stay_or_transit_indicate_the_number_of_days,
        );
        await fillControl(
            page,
            "Intended date of arrival in the Schengen area",
            formData.intended_date_of_arrival_in_the_schengen_area,
        );
        await fillControl(page, "Schengen departure date", formData.schengen_departure_date);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Playwright automation failed", error);
        return NextResponse.json({ error: "Automation failed" }, { status: 500 });
    } finally {
        await browser.close();
    }
}
