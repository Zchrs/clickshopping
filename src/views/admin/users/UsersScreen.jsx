import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import '../../assets/sass/products.scss'
import { 
  AdvisorsScreen,
  ClientsScreen,
  SellersScreen,
  UsersGuest,
  UserVerifications,
} from '../../../../index';

import styled from 'styled-components';

export const UsersScreen = () => {
  return (
    <ScreenProducts className="productsscreen">
      <header className="productsscreen-header">
      <h1>Usuarios</h1>

      </header>
      <aside className="productsscreen-aside">
      <Tabs
      defaultActiveKey="addProduct"
      id="fill-tab-example"
      className="productsscreen-tabs"
      fill
    >
      <Tab eventKey="addProduct" title="Invitados">
       <UsersGuest />
      </Tab>
      <Tab eventKey="addedProducts" title="Usuarios verificados">
       <ClientsScreen />
      </Tab>
      <Tab eventKey="sellingsProduct" title="Asesores comerciales">
        <AdvisorsScreen/>
      </Tab>
      <Tab eventKey="sellingsProduct" title="Vendedores/tiendas">
        <SellersScreen/>
      </Tab>

      <Tab eventKey="sellingsProduct" title="Verificar usuario">
        <UserVerifications />
      </Tab>
    </Tabs>
      </aside>
      <footer className="productsscreen-footer">

      </footer>
    </ScreenProducts>
  )
}

const ScreenProducts = styled.section`
.productsscreen{
    display: grid;
    width: 100%;
    height: fit-content;
    align-items: baseline;
    gap: 25px;
}

`