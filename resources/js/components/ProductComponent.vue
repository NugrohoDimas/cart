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
            <tr v-for="(product, index) in productList" :key="index">
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
import {mapGetters} from 'vuex';

export default {
    name: "ProductComponent",
    data() {
        return {

        }
    },
    props: ["cartItem"],
    computed: {
        ...mapGetters({
            productList: 'getProducts'
        })
    },
    methods: {
        addToCart(data) {
            this.$store.dispatch('addCartItem', data);
        },
    },
    mounted() {
        this.$store.dispatch('getProducts');
    },
}
</script>

<style scoped>

</style>
