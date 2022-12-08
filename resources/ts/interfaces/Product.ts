export interface Product {
    id: number | string;
    attributes: {
        name: string;
        user_id: number;
        description: number;
        code: number | string;
        storage_id: number;
        stock_quantity: number;
        unity_quantity: number;
        for_sale_quantity: number;
        for_sale_status: string | boolean;
        unity_of_measure: string | number;
        price: number,
        price_with_tax: number,
        promotional_price: number;
        promotional_status: boolean | string;
        tax_id: number;
        tax_value: number;
        tax_total_added: number;
        tax_exemption_code: number | string;
        tax_exemption_reason: number | string;
    };
    relationships: {
        tax_types: {
            id: string | number;
            name: string;
            description: string;
            symbol: string;
        }
    }
}
