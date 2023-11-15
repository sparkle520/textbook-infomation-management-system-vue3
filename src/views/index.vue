<!-- @Author: LT -->
<!-- @Date: 2023-11-13 14:16:43 -->
<!-- @Description:  -->

<script setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onBeforeMount(() => {
})
onMounted(() => {
})

</script>
<template>
    <div id="main">
      欢迎使用本系統！
    </div>
</template>
<style lang="scss" scoped>
#main {
    width: 100%;
    margin: 30px;
}
</style>