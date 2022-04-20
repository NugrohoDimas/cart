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
            <tr v-for="(item, index) in checkoutItems.items" :key="index">
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
                <td class="text-center justify-content-center"><strong>Rp. {{
                        checkoutItems.totalPrice
                    }}</strong></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <button type="button" class="btn btn-success mt-2" @click="checkoutAlert">Checkout</button>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "CheckoutComponent",
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters({
            checkoutItems: 'getCheckoutItems'
        })
    },
    methods: {
        deleteItem(data) {
            this.$store.dispatch('deleteCartItem', data);
        },
        checkoutAlert() {
            alert("Chekout Berhasil!");
        },
    },
    mounted() {
        this.$store.dispatch('getCheckoutItems');
    }
}
</script>

<style scoped>

</style>
