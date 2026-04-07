import path from 'node:path';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { isValidPublicDestination } from '@/app/lib/public-routes';

const feature = loadFeature(path.join(__dirname, 'public-routes.feature'));

defineFeature(feature, (test) => {
  let destination = '';
  let isValid = false;

  test('Accept known public shell routes', ({ given, when, then }) => {
    given('implemented public routes are defined', () => {
      destination = '';
      isValid = false;
    });

    when(/^I validate the destination "([^"]+)"$/, (value: string) => {
      destination = value;
      isValid = isValidPublicDestination(destination);
    });

    then('the destination should be valid', () => {
      expect(isValid).toBe(true);
    });
  });

  test('Accept event detail dynamic destinations', ({ given, when, then }) => {
    given('implemented public routes are defined', () => {
      destination = '';
      isValid = false;
    });

    when(/^I validate the destination "([^"]+)"$/, (value: string) => {
      destination = value;
      isValid = isValidPublicDestination(destination);
    });

    then('the destination should be valid', () => {
      expect(isValid).toBe(true);
    });
  });

  test('Reject unknown destinations', ({ given, when, then }) => {
    given('implemented public routes are defined', () => {
      destination = '';
      isValid = false;
    });

    when(/^I validate the destination "([^"]+)"$/, (value: string) => {
      destination = value;
      isValid = isValidPublicDestination(destination);
    });

    then('the destination should be invalid', () => {
      expect(isValid).toBe(false);
    });
  });
});
