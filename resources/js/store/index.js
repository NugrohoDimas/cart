import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        products: [],
        checkoutItems: [],
        totalPrice: 0,
        totalCheckout: 0
    },
    getters: {
        getProducts(state) {
            return state.products;
        },
        getCheckoutItems(state) {
            return {
                items: state.checkoutItems,
                totalPrice: state.totalPrice
            };
        },
        getTotalCheckout(state) {
            return state.totalCheckout;
        },
    },
    mutations: {
        ADD_CART_ITEM(state, payload) {
            state.checkoutItems.push(payload);
        },
        UPDATE_PRODUCT(state, payload) {
            state.products = [...payload];
        },
        UPDATE_PRODUCT_BY_ID(state, payload) {
            state.products = state.products.map(product => {
                if (product.id === payload.id) {
                    return Object.assign({}, product, payload);
                }
                return product;
            });
        },
        UPDATE_CHECKOUT_BY_ID(state, payload) {
            state.checkoutItems = state.checkoutItems.map(item => {
                if (item.id === payload.id) {
                    return Object.assign({}, item, payload);
                }
                return item;
            });
        },
        UPDATE_TOTAL_CHECKOUT(state, payload) {
            payload.forEach(value => {
                state.totalCheckout += value.quantity;
            });
        },
        UPDATE_CHECKOUT_ITEM(state, payload) {
            state.checkoutItems = [...payload];
            payload.forEach(value => {
                state.totalPrice += value.price;
            });
        },
        UPDATE_CHECKOUT(state) {
            state.totalCheckout += 1;
        },
        DELETE_CHECKOUT_ITEM(state, payload) {
            let indexOfCartItem;
            state.checkoutItems.forEach((value,index) => {
                if(value.productId === payload.productId){
                    indexOfCartItem = index;
                    return;
                }
            })
            state.checkoutItems.splice(indexOfCartItem, 1)
        },
        ADD_STOCK_PRODUCT(state, payload) {
            state.products = state.products.map(item => {
                if (item.id === payload.id) {
                    return Object.assign({}, item, payload);
                }
                return item;
            });
        },
        MINUS_TOTAL_CHECKOUT(state, payload) {
            state.totalCheckout -= payload;
        },
        MINUS_TOTAL_PRICE(state, data) {
            state.totalPrice -= data;
        },
    },
    actions: {
        getProducts(context) {
            axios.get("http://localhost:3000/products")
                .then(response => {
                    context.commit('UPDATE_PRODUCT', response.data);
                });
        },
        getCheckoutItems(context) {
            axios.get('http://localhost:3000/cart')
                .then(res => context.commit('UPDATE_CHECKOUT_ITEM', res.data))
                .catch(err => console.log("Gagal : ", err));
        },
        setTotalCheckout(context) {
            axios.get('http://localhost:3000/cart')
                .then(res => context.commit('UPDATE_TOTAL_CHECKOUT', res.data))
                .catch(err => console.log("Gagal : ", err));
        }
        ,
        async addCartItem(context, data) {
            //Mengurangi stock produk
            axios.put('http://localhost:3000/products/' + data.id, {
                stock: data.stock - 1,
                name: data.name,
                description: data.description,
                price: data.price

            })
                .then(response => {
                    context.commit('UPDATE_PRODUCT_BY_ID', response.data);
                    context.commit('UPDATE_CHECKOUT');
                })
                .catch(error => {
                    console.log(error);
                });

            // Menambahkan atau mengupdate data di cart
            let test;
            await axios.get('http://localhost:3000/cart?name=' + data.name)
                .then(res => {
                    test = {
                        "id": res.data[0].id,
                        "name": res.data[0].name,
                        "quantity": res.data[0].quantity,
                        "description": res.data[0].description,
                        "price": res.data[0].price,
                        "productId": res.data[0].productId
                    };
                })
                .catch(err => console.log("Gagal : ", err));

            if (test) {
                const newQuantity = test.quantity + 1;
                axios.put('http://localhost:3000/cart/' + test.id, {
                    quantity: newQuantity,
                    name: test.name,
                    price: test.price * newQuantity,
                    description: test.description,
                    productId: test.productId
                })
                    .then(response => {
                        context.commit('UPDATE_CHECKOUT_BY_ID', response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                const cartProduct = {
                    "name": data.name,
                    "quantity": 1,
                    "price": data.price,
                    "description": data.description,
                    "productId": data.id
                };

                axios.post('http://localhost:3000/cart/', cartProduct)
                    .then(res => {
                        context.commit('ADD_CART_ITEM', res.data);
                    });
            }
        },
        async deleteCartItem(context, data) {
            console.log(data);
            let product;
            await axios.get('http://localhost:3000/products?id=' + data.productId)
                .then(res => {
                    product = {
                        "id": res.data[0].id,
                        "name": res.data[0].name,
                        "stock": res.data[0].stock,
                        "description": res.data[0].description,
                        "price": res.data[0].price
                    };
                })
                .catch(err => console.log("Gagal : ", err));

            axios.delete("http://localhost:3000/cart/" + data.id)
                .then(response => {
                    context.commit('DELETE_CHECKOUT_ITEM', data);
                    context.commit('MINUS_TOTAL_CHECKOUT', data.quantity);
                    context.commit('MINUS_TOTAL_PRICE', data.price);

                    axios.put("http://localhost:3000/products/" + product.id, {
                        stock: product.stock + data.quantity,
                        name: product.name,
                        price: product.price,
                        description: product.description
                    }).then(response => {
                        context.commit('ADD_STOCK_PRODUCT', response.data);
                    });
                });
        },
    }
});

