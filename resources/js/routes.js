import Product from './components/ProductComponent.vue';
import Checkout from './components/CheckoutComponent.vue';

export const routes = [
    {path: '/display/product', component: Product, name: "Product"},
    {path: '/display', component: Product, name: "Home"},
    {path: '/display/checkout', component: Checkout, name: "Checkout"}
];
