<template>
  
  <div>
    <h4>상세페이지</h4>
    <h5>{{블로그글[$route.params.id].title}}</h5>
    <p>{{블로그글[$route.params.id].content}}</p>

    <router-view></router-view>
  </div>
  
</template>

<script>
export default {
    //eslint-disable-next-line
    name : 'Detail',
    props : {
      블로그글 : Array,
    }
}
</script>

<style>

</style>