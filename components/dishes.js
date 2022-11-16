import { useRouter } from "next/router"
import { gql, useQuery } from '@apollo/client';
import { useState, useContext } from 'react'
import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col} from "reactstrap";

function Dishes({restId}){
  const [restaurantID, setRestaurantID] = useState()
  const { addItem } = useContext(AppContext)

  // update this to get menu instead of dishes
  const GET_RESTAURANT_DISHES = gql`
    query($id: ID!) {
      restaurant(id: $id) {
        id
        name
        dishes {
          id
          name
          description
          price
          image {
            url
          }
        }
      }
    }
  `;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId},
  });
  //if restaurants are returned from the GraphQL query, run the filter query
  //and set equal to variable restaurantSearch
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error with Menu Items</p>;
  if (!data) return <p>Not found</p>;

  let restaurant = data.restaurant; // because graphQL schema is nested with data{restaurant{dishes}}

  if (restId > 0){

    return (
      <>
        {restaurant.dishes.map((res) => (
          <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
            <Card style={{ margin: "0 10px" }}>
              <CardImg
                top={true}
                style={{ height: 150, width:150 }}
                src={`http://localhost:1337${res.image.url}`}
              />
              <CardBody>
                <CardTitle>{res.name}</CardTitle>
                <CardText>{res.description}</CardText>
              </CardBody>
              <div className="card-footer">
                <Button 
                  outline="info"
                  color="primary"
                  onClick = {()=> addItem(res)} //addItem is a function that is passed from the context - _app.js
                >
                  + Add To Order
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </>
      )}
      else{
        return <h1> Pick a Café </h1>
      }
    }
export default Dishes