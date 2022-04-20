<template>
    <div>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">Name</th>
                <th scope="col" class="text-center justify-content-center">Quantity</th>
                <th scope="col" class="text-center justify-content-center">Price</th>
                <th scope="col"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.name }}</td>
                <td class="text-center justify-content-center">{{ item.quantity }}</td>
                <td class="text-center justify-content-center">Rp. {{ item.price }}</td>
                <td>
                    <button type="button" class="btn btn-danger m-lg-auto" @click="deleteItem(item)">Delete</button>
                </td>
            </tr>
            <tr>
                <td><strong>Total :</strong></td>
                <td></td>
                <td class="text-center justify-content-center" v-model="totalPrice"><strong>Rp. {{
                        totalPrice
                    }}</strong></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <button type="button" class="btn btn-success mt-2" @click="checkoutAlert">Checkout</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "CheckoutComponent",
    data() {
        return {
            items: [],
            totalPrice: 0
        };
    },
    methods: {
        setListCheckout(data) {
            this.items = data;
            data.forEach(value => {
                this.totalPrice += value.price;
            });
        },
        deleteItem(data) {
            axios.delete("http://localhost:3000/cart/" + data.id)
                .then(response => {
                    console.log(response);
                });
        },
        checkoutAlert() {
            alert("Chekout Berhasil!");
        },
    },
    mounted() {
        axios.get('http://localhost:3000/cart')
            .then(res => this.setListCheckout(res.data))
            .catch(err => console.log("Gagal : ", err));
    }
}
</script>

<style scoped>

</style>
