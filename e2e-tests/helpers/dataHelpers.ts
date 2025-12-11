import { faker } from "@faker-js/faker";

export const userData = {
	firstName: faker.person.firstName().toString(),
	middleName: faker.person.middleName().toString(),
	lastName: faker.person.lastName().toString(),
	phoneNumber: faker.phone.number({ style: "national" }).toString(),
	email: faker.internet.email().toString(),
	zipCode: faker.location.zipCode().toString(),
	password: faker.internet.password().toString(),
};

export function generateTimeStamp() {
	const now = new Date();
	const month = `${now.getMonth() + 1}`.padStart(2, "0");
	const day = `${now.getDate()}`.padStart(2, "0");
	const hours = `${now.getHours()}`.padStart(2, "0");
	const minutes = `${now.getMinutes()}`.padStart(2, "0");
	const seconds = `${now.getSeconds()}`.padStart(2, "0");
	return `${month}${day}${hours}${minutes}${seconds}`;
}

export function generateEmail() {
	const timeStamp = generateTimeStamp();
	return `dustin+test${timeStamp}@goodparty.org`;
}

export function generatePhone() {
	const timeStamp = generateTimeStamp();
	const number = `5105${timeStamp.slice(-6)}`;
	return number;
}
