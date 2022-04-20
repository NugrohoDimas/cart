import Product from './components/ProductComponent.vue';
import Checkout from './components/CheckoutComponent.vue';

export const routes = [
    {path: '/product', component: Product, name: "Product"},
    {path: '/', component: Product, name: "Home"},
    {path: '/checkout', component: Checkout, name: "Checkout"}
];
