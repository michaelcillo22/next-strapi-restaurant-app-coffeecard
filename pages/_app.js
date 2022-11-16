/* _app.js */
import React from "react";
import { useContext, useState } from "react";
import App from "next/app";
import Head from "next/head";
import fetch from "isomorphic-fetch";
import AppContext from "../components/context";
import Home from "./index"
import Layout from "../components/layout"
import Cookie from "js-cookie"


function MyApp(props){
  var {cart, addItem, removeItem, user, setUser} = useContext(AppContext)
  const [state, setState] = useState({ cart:cart });
  const { Component, pageProps } = props;
  
  // set user becomes a function that sets the user in the context
  setUser = (user) => {
    setState({ user });
  };

  // function componentDidMount(){
  //   // grab token value from cookie
  //   const token = Cookie.get("token");
  //   // restore cart from cookie, this could also be tracked in a db
  //   const cart = Cookie.get("cart");
  //   //if items in cart, set items and total from cookie
  //   //console.log(cart);

  //   if (typeof cart === "string" && cart !== "undefined") {
  //     console.log("foyd");
  //     JSON.parse(cart).forEach((item) => {
  //       this.setState({
  //         cart: { items: JSON.parse(cart), total: item.price * item.quantity },
  //       });
  //     });
  //   }

  //   if (token) {
  //     // authenticate the token on the server and place set user object
  //     fetch(`${process.env.NEXT_PUBLIC_API_URL}users`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }).then(async (res) => {
  //       // if res comes back not valid, token is not valid
  //       // delete the token and log the user out on client
  //       if (!res.ok) {
  //         Cookie.remove("token");
  //         this.setState({ user: null });
  //         return null;
  //       }
  //       const user = await res.json();
  //       this.setUser(user);
  //     });
  //   }
  // }
  
  addItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    //if not in cart, add item if item is found increase quanity ++
    // we dont want to add the same item UI twice just the number property and price difference
    let foundItem = true;
    if(items.length > 0){
      foundItem = items.find((i) => i.id === item.id);
     
      if(!foundItem) foundItem = false;
    }
    else{
      foundItem = false;
    }
    console.log(`Found Item value: ${JSON.stringify(foundItem)}`)
    // if item is not new, add to cart, set quantity to 1
    if (!foundItem) {
      //set quantity property to 1
    
      let temp = JSON.parse(JSON.stringify(item));
      temp.quantity = 1;
      var newCart = {
          items: [...state.cart.items,temp],
          total: state.cart.total + item.price,
      }
      setState({cart:newCart})
      console.log(`Total items: ${JSON.stringify(newCart)}`)
    } else {
      // we already have it so just increase quantity ++
      console.log(`Total so far:  ${state.cart.total}`)
      newCart= {
          items: items.map((item) =>{
            if(item.id === foundItem.id){
              return Object.assign({}, item, { quantity: item.quantity + 1 })
             }else{
            return item;
          }}),
          total: state.cart.total + item.price,
        }
    }
    setState({cart: newCart});  // problem is this is not updated yet
    console.log(`state reset to cart:${JSON.stringify(state)}`)
     
  };
  removeItem = (item) => {
    let { items } = state.cart;
    //check for item already in cart
    const foundItem = items.find((i) => i.id === item.id);
    if (foundItem.quantity > 1) {
      var newCart = {
        items: items.map((item) =>{
        if(item.id === foundItem.id){
          return Object.assign({}, item, { quantity: item.quantity - 1 })
         }else{
        return item;
      }}),
      total: state.cart.total - item.price,
      }
      //console.log(`NewCart after remove: ${JSON.stringify(newCart)}`)
    } else { // only 1 in the cart so remove the whole item
      console.log(`Try remove item ${JSON.stringify(foundItem)}`)
      const index = items.findIndex((i) => i.id === foundItem.id);
      items.splice(index, 1);
      var newCart= { items: items, total: state.cart.total - item.price } 
    }
    setState({cart:newCart});
  }

  return (
    <AppContext.Provider 
      value={{
        cart: state.cart, 
        addItem: addItem, 
        removeItem: removeItem,
        isAuthenticated:false,
        user:null,
        setUser:()=>{}
      }}
      >
      <Head> <>{/* CDN for reactstrap*/}</>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
    
      <Layout>
          <Component {...pageProps} />
      </Layout>

    </AppContext.Provider>
  );
  
}


export default MyApp;
