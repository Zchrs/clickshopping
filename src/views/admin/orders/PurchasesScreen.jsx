import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { OrdersComplete } from "./OrdersComplete";
import { OrdersPending } from "./OrdersPending";
import { OrdersCancelled } from "./OrdersCancelled";
import styled from "styled-components";

export const PurchasesScreen = () => {
  return (
    <Orders>
      <header className="productsscreen-header">
        <h1>Pedidos</h1>
      </header>
      <aside className="productsscreen-aside">
        <Tabs
          defaultActiveKey="completedOrders"
          id="fill-tab-example"
          className="productsscreen-tabs"
          fill>
          <Tab eventKey="completedOrders" title="Pedidos completados">
            <OrdersComplete />
          </Tab>
          <Tab eventKey="pendingsOrders" title="Pedidos pendientes">
            <OrdersPending />
          </Tab>
          <Tab eventKey="cancelledOrders" title="Pedidos cancelados">
            <OrdersCancelled />
          </Tab>
        </Tabs>
      </aside>
      <footer className="productsscreen-footer"></footer>
    </Orders>
  );
};

const Orders = styled.section`
  .productsscreen {
    display: grid;
    width: 100%;
    height: fit-content;
    align-items: baseline;
    gap: 25px;
  }

  .nav {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    width: fit-content;
    border-bottom: var(--primary-light) 1px solid;
  }

  .nav-link {
    display: grid;
    gap: 5px;
    color: black;
    text-decoration: none;
    background: white;
    border: var(--primary-light) 1px solid;
    transition: all ease 0.5s;
    border-radius: 8px 8px 0 0;

    &:hover {
      background: var(--primary);
      color: white;
      transform: scale(1.05);
    }
  }

  .nav-tabs .nav-link.active {
    background: var(--primary);
    color: white;
    border-bottom: var(--primary) 1px solid;
    border-radius: 8px 8px 0 0;
  }

  .nav-tabs .nav-item.show {
    border: #ec3337 1px solid;
    display: grid;
  }
`;
