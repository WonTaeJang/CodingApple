import axios from 'axios';
import React, { useState, useEffect,useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import './Detail.scss'
import {재고context} from './App.js';
import {CSSTransition} from "react-transition-group";
import { connect } from "react-redux";

//  styled-components
// CSS를 미리 입혀놓은 컴포넌트
let 박스 = styled.div`
  padding : 20px;
`;

let 제목 = styled.h4`
  font-size : 25px;
  color : ${ props => props.색상 }
`

// Hook: Component Lifecycle 중간중간에 뭔가 명령을 줄 수 있음
class Detail2 extends React.Component {
  // Detail2 컴포넌트가 Mount 되었을 때 실행할 코드
  componentDidMount(){

  }

  // Detail2 컴포넌트가 해제(Unmount)될때 실행할 코드
  componentWillUnmount(){

  }
}

function Detail(props) {

  let [visible, setVisible] = useState({visibility:'none'});
  let [alert, alert변경] = useState(true);
  let [inputData, inputData변경] = useState('');
  let 재고 = useContext(재고context);
  
  let [누른텝, 누른텝변경] = useState(0);
  let [스위치, 스위치변경] = useState(false);

  // get 요청을 Detail component가 처음 실행될때만 사용하고 싶다면 
  // [] 를 넣으면 조건에 부합하지 않기때문에 처음만 실행된다.
  // useEffect(()=>{
  //   axios.get();
  // },[])

  // 컴포넌트가 mount 되었을 때, 컴포넌트가 update 되었을 때 
  // useEffect는 여러개 작성해도 되고 적은 순서대로 실행된다.
  
  useEffect(()=>{
        // 2초후에 alert창을 사라지게 하기
    //console.log(visible);
    let 타이머 = setTimeout(()=>{
      setVisible({visibility:'hidden'});
      alert변경(false);
    },2000);

    //console.log('sdf');

    // Detail function이 사라질때 실행되는 코드
    return ()=>{clearTimeout(타이머)} // setTimeout이 동작하고 2초가 되기전에 뒤로가기 버튼같은걸 눌렀을때 버그가 발생하는걸 방지할 수 있다.
  },[alert, inputData]); // [alert]라고 넣으면 alert 값이 변경될때만 실행되게 된다.


  let history = useHistory();
  let { id } = useParams();

  let 찾은상품 = props.shoes.find(function(상품){
    return 상품.id == id
  });

  useEffect(()=>{
    console.log('detail:', id);

    // RVI Resent View Items

    let resentViewList = [];

    if(localStorage.getItem('RVI') != null)
    {
      resentViewList = JSON.parse(localStorage.getItem('RVI'));
    }

    // 중복 검증 필요
    if(!resentViewList.includes(id))
      resentViewList.push(id);

    localStorage.setItem('RVI', JSON.stringify(resentViewList));
  },[])

  return (
    <div className="container">

      <박스>
        <제목 className='red'>상세 페이지</제목>
      </박스>

      <input onChange={(e)=>{inputData변경(e.target.value)}}></input>

      {
        alert === true ? 
        <div className='my-alert2' style={props.vb}>
          <p>재고가 얼마 남지 않았습니다.</p>
        </div> 
        : null
      }

      {/* <Alert vb={visible}></Alert> */}

      <div className="row">
        <div className="col-md-6">
          <img src={`https://codingapple1.github.io/shop/shoes${(찾은상품.id + 1)}.jpg`} width="100%" />
        </div>
        <div className="col-md-6 mt-4">
          <h4 className="pt-5">{찾은상품.title}</h4>
          <p>{찾은상품.content}</p>
          <p>{찾은상품.price}</p>
          <Info 재고={props.재고}></Info>
          <button className="btn btn-danger" onClick={()=>{
            // state 조작하는법
            // 1. state의 사본을 만들고
            // 2. 사본을 변경함
            // 3. 사본을 변경함수에 집어넣기
            props.재고변경([9,11,12])
            props.dispatch({type : '항목추가', payload : {id:찾은상품.id, name:찾은상품.title, quan:1}})
            history.push('/cart');
          }}>주문하기</button>
          <button className="btn btn-danger" onClick={() => { 
            history.goBack(); 
          }}>뒤로가기</button>
        </div>
      </div>

      {/* Tab UI 만드는법
        1. 몇번째 버튼 눌렀는지를 state로 저장해둠
        2. state에 따라 UI 보이게 안보이게
      */}

      <Nav className='mt-5' variant="tabs" defaultActiveKey="link-0">
        <Nav.Item>
          <Nav.Link eventKey="link-0" onClick={()=>{스위치변경(false); 누른텝변경(0)}}>Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1" onClick={()=>{스위치변경(false); 누른텝변경(1)}}>Option 2</Nav.Link>
        </Nav.Item>
      </Nav>

      <CSSTransition in={스위치} classNames="wow" timeout={500}>
        <TabContent 누른텝={누른텝} 스위치변경={스위치변경}></TabContent>
      </CSSTransition>
     
    </div>
  )

  function Info(props){
    return(
      <p>재고: {props.재고[0]}</p>
    )
    
  }

  function TabContent(props){

    useEffect(()=>{
      props.스위치변경(true);
    })

    if(props.누른텝 === 0){
      return <div>0번째 내용입니다.</div> 
    } else if(props.누른텝 === 1){
      return <div>1번째 내용입니다.</div> 
    } else if(props.누른텝 === 2){
      return <div>2번째 내용입니다.</div> 
    }    
  }

}

// state를 props화 하는 함수
function 함수명(state){
  console.log(state);
  return {
      state : state.reducer,
      alert열렸니 : state.reducer2
  }
}

export default connect(함수명)(Detail)