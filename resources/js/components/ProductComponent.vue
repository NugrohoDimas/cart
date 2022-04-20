<template>
    <div>
        <table class="table">
            <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Stock</th>
                <th scope="col">Price</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in products" :key="index">
                <th scope="row"> {{ product.id }}</th>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.stock }}</td>
                <td>Rp. {{ product.price }}</td>
                <td><button type="button" class="btn btn-primary" @click="addToCart(product)">Add to Cart</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from "axios"

export default {
    name: "ProductComponent",
    data() {
        return {
            products: []
        }
    },
    props: ["cartItem"],
    methods: {
        setProduct(data) {
            this.products = data;
        },
        async addToCart(data) {
            //Mengurangi stock di products
            axios.put('http://localhost:3000/products/' + data.id, {
                stock: data.stock - 1,
                name: data.name,
                description: data.description,
                price: data.price

            })
                .then(response => {
                    console.log("Berhasil mengurangi stock");
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
                        "price": res.data[0].price
                    };
                })
                .catch(err => console.log("Gagal : ", err));

            if (test) {
                console.log("Update")
                const newQuantity = test.quantity + 1;
                axios.put('http://localhost:3000/cart/' + test.id, {
                    quantity: newQuantity,
                    name: test.name,
                    price: test.price * newQuantity

                })
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                console.log("Create")
                const cartProduct = {
                    "name": data.name,
                    "quantity": 1,
                    "price": data.price
                };

                axios.post('http://localhost:3000/cart/', cartProduct)
                    .then(res => {
                        return res;
                    });
            }
        },
    },
    mounted() {
        axios.get('http://localhost:3000/products')
            .then(res => this.setProduct(res.data))
            .catch(err => console.log("Gagal : ", err));
    },
}
</script>

<style scoped>

</style>
