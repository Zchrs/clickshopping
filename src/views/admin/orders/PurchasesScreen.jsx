import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { OrdersComplete } from "./OrdersComplete";
import { OrdersPending } from "./OrdersPending";
import { OrdersCancelled } from "./OrdersCancelled";
import styled from "styled-components";
import { PendingSend } from "./PendingSend";

export const PurchasesScreen = () => {
  return (
    <Orders>
      <header className="productsscreen-header">
        <h1>Pedidos</h1>
      </header>
      <aside className="productsscreen-aside">
        <Tabs
          defaultActiveKey="pendingAprove"
          id="fill-tab-example"
          className="productsscreen-tabs"
          fill>
            <Tab eventKey="pendingAprove" title="Pendientes de aprobación">
            <OrdersPending />
          </Tab>
          <Tab eventKey="pendingSend" title="Pendientes de envío">
            <PendingSend />
          </Tab>
          <Tab eventKey="completedOrders" title="Completados y enviados">
            <OrdersComplete />
          </Tab>
          <Tab eventKey="cancelledOrders" title="Cancelados">
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

  
`;
