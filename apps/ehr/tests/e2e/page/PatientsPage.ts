import { expect, Page } from '@playwright/test';
import { dataTestIds } from '../../../src/constants/data-test-ids';
import { PageWithTablePagination } from './PageWithTablePagination';

export class PatientsPage extends PageWithTablePagination {
  #page: Page;

  constructor(page: Page) {
    super(page);
    this.#page = page;
  }

  async searchByLastName(name: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByLastNameField).locator('input').fill(name);
  }

  async searchByGivenNames(names: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByGivenNamesField).locator('input').fill(names);
  }

  async searchByDateOfBirth(dateOfBirth: string): Promise<void> {
    const locator = this.#page.getByTestId(dataTestIds.patients.searchByDateOfBirthField).locator('input');
    await locator.click();
    await locator.fill(dateOfBirth);
  }

  async searchByMobilePhone(phone: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByPhoneField).locator('input').fill(phone);
  }

  async searchByAddress(address: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByAddressField).locator('input').fill(address);
  }

  async searchByEmail(email: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByEmailField).locator('input').fill(email);
  }

  async searchByStatus(statusName: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByStatusName).click();
    await this.#page.getByText(new RegExp(statusName, 'i')).click();
  }

  async searchByLocation(locationName: string): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchByLocationName).click();
    await this.#page.getByText(new RegExp(locationName, 'i')).click();
  }

  async clickSearchButton(): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.searchButton).click();
  }

  async clickResetFiltersButton(): Promise<void> {
    await this.#page.getByTestId(dataTestIds.patients.resetFiltersButton).click();
  }

  async verifyFilterReset(): Promise<void> {
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByLastNameField).locator('input')).toBeEmpty();
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByGivenNamesField).locator('input')).toBeEmpty();
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByDateOfBirthField).locator('input')).toBeEmpty();
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByPhoneField).locator('input')).toBeEmpty();
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByAddressField).locator('input')).toBeEmpty();
    await expect(this.#page.getByTestId(dataTestIds.patients.searchByEmailField).locator('input')).toBeEmpty();
  }

  async verifyPatientPresent(patientInfo: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: string;
  }): Promise<void> {
    const patientPresent = await this.findInPages(
      async () => {
        const rowLocator = this.#page.getByTestId(dataTestIds.patients.searchResultRow(patientInfo.id));
        if (!(await rowLocator.isVisible())) {
          console.log(`❌ Row for patient ID ${patientInfo.id} is not visible in current page`);
          return false;
        }

        const rowPatientId = await rowLocator.getByTestId(dataTestIds.patients.patientId).innerText();
        const rowPatientName = await rowLocator.getByTestId(dataTestIds.patients.patientName).innerText();
        const rowPatientDateOfBirth = await rowLocator.getByTestId(dataTestIds.patients.patientDateOfBirth).innerText();
        const rowPatientEmail = await rowLocator.getByTestId(dataTestIds.patients.patientEmail).innerText();
        const rowPatientPhoneNumber = await rowLocator.getByTestId(dataTestIds.patients.patientPhoneNumber).innerText();
        const rowPatientAddress = await rowLocator.getByTestId(dataTestIds.patients.patientAddress).innerText();

        const expectedName = patientInfo.lastName + ', ' + patientInfo.firstName;
        const normalizedExpectedPhone = patientInfo.phoneNumber.replace(/[^\d]/g, '');
        const normalizedActualPhone = rowPatientPhoneNumber.replace(/^(\+1)/, '').replace(/[^\d]/g, '');
        const expectedAddress = patientInfo.address;

        const idMatch = rowPatientId === patientInfo.id;
        const nameMatch = rowPatientName === expectedName;
        const dobMatch = rowPatientDateOfBirth === patientInfo.dateOfBirth;
        const emailMatch = rowPatientEmail === patientInfo.email;
        const phoneMatch = normalizedActualPhone === normalizedExpectedPhone;
        const addressMatch = rowPatientAddress === expectedAddress;

        const allMatches = idMatch && nameMatch && dobMatch && emailMatch && phoneMatch && addressMatch;

        if (!allMatches) {
          console.log(`❌ Patient verification failed for ID: ${patientInfo.id}`);

          if (!idMatch) {
            console.log(`  - ID mismatch:
              Expected: "${patientInfo.id}"
              Actual:   "${rowPatientId}"`);
          }

          if (!nameMatch) {
            console.log(`  - Name mismatch:
              Expected: "${expectedName}"
              Actual:   "${rowPatientName}"`);
          }

          if (!dobMatch) {
            console.log(`  - Date of Birth mismatch:
              Expected: "${patientInfo.dateOfBirth}"
              Actual:   "${rowPatientDateOfBirth}"`);
          }

          if (!emailMatch) {
            console.log(`  - Email mismatch:
              Expected: "${patientInfo.email}"
              Actual:   "${rowPatientEmail}"`);
          }

          if (!phoneMatch) {
            console.log(`  - Phone Number mismatch:
              Expected: "${patientInfo.phoneNumber}" (normalized: "${normalizedExpectedPhone}")
              Actual:   "${rowPatientPhoneNumber}" (normalized: "${normalizedActualPhone}")`);
          }

          if (!addressMatch) {
            console.log(`  - Address mismatch:
              Expected: "${JSON.stringify(expectedAddress)}"
              Actual:   "${JSON.stringify(rowPatientAddress)}"`);
          }
        }

        return allMatches;
      },
      async () => {
        // Ensure search results update after response is received
        await this.#page
          .getByTestId(/search-result-row-/i)
          .first()
          .waitFor({ state: 'attached' });
      }
    );

    await expect.soft(patientPresent).toBe(true);
  }
}

export async function expectPatientsPage(page: Page): Promise<PatientsPage> {
  await page.waitForURL('/patients');
  await page.locator('p').getByText('Set up search filter and press Search to find patients').isVisible();
  return new PatientsPage(page);
}
