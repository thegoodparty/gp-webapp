import { faker } from '@faker-js/faker';

export const userData = {
    firstName: faker.person.firstName().toString(),
    middleName: faker.person.middleName().toString(),
    lastName: faker.person.lastName().toString(),
    phoneNumber: faker.phone.number({style: 'national'}).toString(),
    email: faker.internet.email().toString()
};