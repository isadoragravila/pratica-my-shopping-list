import { faker } from "@faker-js/faker";

export function itemFactory() {
    return {
        title: faker.commerce.product(),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(3),
        amount: Number(faker.commerce.price(50, 300))
    }
}