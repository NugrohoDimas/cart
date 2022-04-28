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
                if (product._id === payload._id) {
                    return Object.assign({}, product, payload);
                }
                return product;
            });
        },
        UPDATE_CHECKOUT_BY_ID(state, payload) {
            state.checkoutItems = state.checkoutItems.map(item => {
                if (item._id === payload._id) {
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
                state.totalPrice += parseInt(value.price);
            });
        },
        UPDATE_CHECKOUT(state) {
            state.totalCheckout += 1;
        },
        DELETE_CHECKOUT_ITEM(state, payload) {
            let indexOfCartItem;
            state.checkoutItems.forEach((value,index) => {
                if(value.product_id === payload.product_id){
                    indexOfCartItem = index;
                    return;
                }
            })
            state.checkoutItems.splice(indexOfCartItem, 1)
        },
        ADD_STOCK_PRODUCT(state, payload) {
            state.products = state.products.map(item => {
                if (item._id === payload._id) {
                    return Object.assign({}, item, payload);
                }
                return item;
            });
        },
        MINUS_TOTAL_CHECKOUT(state, payload) {
            state.totalCheckout -= payload;
        },
        MINUS_TOTAL_PRICE(state, data) {
            state.totalPrice -= parseInt(data);
        },
    },
    actions: {
        getProducts(context) {
            axios.get("http://localhost:8000/data/product")
                .then(response => {
                    context.commit('UPDATE_PRODUCT', response.data);
                });
        },
        getCheckoutItems(context) {
            axios.get('http://localhost:8000/data/cart')
                .then(res => context.commit('UPDATE_CHECKOUT_ITEM', res.data))
                .catch(err => console.log("Gagal : ", err));
        },
        setTotalCheckout(context) {
            axios.get('http://localhost:8000/data/cart')
                .then(res => context.commit('UPDATE_TOTAL_CHECKOUT', res.data))
                .catch(err => console.log("Gagal : ", err));
        }
        ,
        async addCartItem(context, data) {
            //Mengurangi stock produk
            axios.put('http://localhost:8000/data/product/' + data._id, {
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
            await axios.get('http://localhost:8000/data/cart/product/' + data._id)
                .then(res => {
                    test = {
                        "_id": res.data[0]._id,
                        "name": res.data[0].name,
                        "quantity": res.data[0].quantity,
                        "description": res.data[0].description,
                        "price": res.data[0].price,
                        "product_id": res.data[0].product_id
                    };
                })
                .catch(err => console.log("Gagal : ", err));

            if (test) {
                const newQuantity = test.quantity + 1;
                axios.put('http://localhost:8000/data/cart/' + test._id, {
                    quantity: newQuantity,
                    name: test.name,
                    price: data.price * newQuantity,
                    description: test.description,
                    product_id: test.product_id
                })
                    .then(response => {
                        context.commit('UPDATE_CHECKOUT_BY_ID', response.data);
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    });
            } else {
                axios.post('http://localhost:8000/data/cart/', {
                    name: data.name,
                    quantity: 1,
                    price: data.price,
                    product_id: data._id
                })
                    .then(res => {
                        context.commit('ADD_CART_ITEM', res.data);
                    })
                    .catch(error => {
                        console.log(error.response.data)
                    });
            }
        },
        async deleteCartItem(context, data) {
            let product;
            await axios.get('http://localhost:8000/data/product/' + data.product_id)
                .then(res => {
                    product = {
                        "_id": res.data[0]._id,
                        "name": res.data[0].name,
                        "stock": res.data[0].stock,
                        "description": res.data[0].description,
                        "price": res.data[0].price
                    };
                })
                .catch(err => console.log("Gagal : ", err));

            axios.delete("http://localhost:8000/data/cart/" + data._id)
                .then(response => {
                    context.commit('DELETE_CHECKOUT_ITEM', data);
                    context.commit('MINUS_TOTAL_CHECKOUT', data.quantity);
                    context.commit('MINUS_TOTAL_PRICE', data.price);

                    axios.put("http://localhost:8000/data/product/" + product._id, {
                        stock: product.stock + data.quantity,
                        name: product.name,
                        price: product.price,
                        description: product.description
                    }).then(response => {
                        context.commit('ADD_STOCK_PRODUCT', response.data);
                    }).catch(error => {
                        console.log(error.response.data);
                    });
                });
        },
    }
});

