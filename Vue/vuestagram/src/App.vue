<template>
  <div class="header">
    <ul class="header-button-left">
      <li>Cancel</li>
    </ul>
    <ul class="header-button-right">
      <li v-if="step == 1" @click="step++">Next</li>
      <li v-if="step == 2" @click="publish">발행</li>
    </ul>
    <img src="./assets/logo.png" class="logo" />
  </div>

  <div>안녕 {{$store.state.name}}</div>
  <div>안녕 {{$store.state.age}}</div>
  <button @click="$store.commit('이름변경')">이름 변경</button>
  <button @click="$store.commit('나이증가',10)">나이 증가</button>

  <Container v-bind:story="story" v-bind:step="step" v-bind:imgURL="imgURL" @write="작성한글 = $event"/>


  <p>{{$store.state.more}}</p>
  <!-- dispatch 는 store에 actions를 호출 -->
  <button @click="$store.dispatch('getData')">더보기 vuex</button>

  <div class="footer">
    <ul class="footer-button-plus">
      <input
        @change="upload"
        accept="image/*"
        type="file"
        id="file"
        class="inputfile"
      />
      <label for="file" class="input-plus">+</label>
    </ul>
  </div>
</template>

<script>
import Container from "./components/Container.vue";
import postdata from "./data/post.js";
import axios from "axios";
import {mapMutations, mapState} from 'vuex'

export default {
  name: "App",
  data() {
    return {
      step: 3, // 현재 페이지 상태 저장
      story: postdata,
      count: 0,
      imgURL: "",
      작성한글 : '',
      filter : '',
      카운터: 0,
    };
  },
  components: {
    Container: Container,
  },
  computed : {
    // method와 비슷한 기능
    /*
      computed함수는 최초 1회만 실행되고 더이상 재실행 되지 않는다. 
      처음 실행한 값을 간직함

      자원 절약에 용이

      computed는 매개변수를 넣을 수 없음 

      return은 필수이다.
    */ 

   name(){
    // vuex에서 state를 꺼내쓸 때 유용하다
    return this.$store.state.name
   },
   ...mapState(['name','age', 'likes']),
   ...mapState({작명:'name',})  // 다른이름 쓰고 싶다면 object형식으로 
  },
  methods: {
    more() {
      axios
        .get(`https://codingapple1.github.io/vue/more${this.count % 2}.json`)
        .then((result) => {
          //요청성공시 실행할 코드
          console.log(result.data);
          this.story.push(result.data);
        });

      this.count++;
    },
    upload(e) {
      let imgFile = e.target.files;

      // blob(binary) url생성
      this.imgURL = URL.createObjectURL(imgFile[0]);

      // 다음 페이지로 넘어가기
      this.step++;
    },
    publish() {
      // 발행 함수
      var 내게시물 = {
        name: "Kim Hyun",
        userImage: "https://placeimg.com/100/100/arch",
        postImage: this.imgURL,
        likes: 36,
        date: "May 15",
        liked: false,
        content: this.작성한글,
        filter: this.filter,
      };
      this.story.unshift(내게시물);
      this.step = 0;
    },
  },
  mounted(){
    this.emitter.on('filter', (a)=>{
      this.filter = a;
      this.story.filter = a;
    })
  },
  ...mapMutations(['setMore', '좋아요']),
};
</script>

<style>
body {
  margin: 0;
}
ul {
  padding: 5px;
  list-style-type: none;
}
.logo {
  width: 22px;
  margin: auto;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 13px;
}
.header {
  width: 100%;
  height: 40px;
  background-color: white;
  padding-bottom: 8px;
  position: sticky;
  top: 0;
}
.header-button-left {
  color: skyblue;
  float: left;
  width: 50px;
  padding-left: 20px;
  cursor: pointer;
  margin-top: 10px;
}
.header-button-right {
  color: skyblue;
  float: right;
  width: 50px;
  cursor: pointer;
  margin-top: 10px;
}
.footer {
  width: 100%;
  position: sticky;
  bottom: 0;
  padding-bottom: 10px;
  background-color: white;
}
.footer-button-plus {
  width: 80px;
  margin: auto;
  text-align: center;
  cursor: pointer;
  font-size: 24px;
  padding-top: 12px;
}
.sample-box {
  width: 100%;
  height: 600px;
  background-color: bisque;
}
.inputfile {
  display: none;
}
.input-plus {
  cursor: pointer;
}
#app {
  box-sizing: border-box;
  font-family: "consolas";
  margin-top: 60px;
  width: 100%;
  max-width: 460px;
  margin: auto;
  position: relative;
  border-right: 1px solid #eee;
  border-left: 1px solid #eee;
}
</style>
