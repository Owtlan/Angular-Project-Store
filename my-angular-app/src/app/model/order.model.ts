export interface Order {
    id?: string;
    userId: string;
    products: { productId: string; quantity: number }[];
    totalPrice: Number;
    orderDate: Date;
    shippingDetails: {
        address: string;
        city: string;
        postalCode: string;
        phoneNumber: string;
    }
}