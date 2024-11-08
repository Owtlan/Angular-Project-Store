export interface Product {
    category?: string;
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    ownerId: string;
    colorImages?: { color: string; imageUrl: string }[];
}