import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
// import '../../assets/sass/products.scss'
import { CancelledProducts, CreateProduct, PendingProducts, ProductsAdded, SellingProducts } from '../../../../index';

import styled from 'styled-components';

export const ProductsScreen = () => {
  return (
    <ScreenProducts className="productsscreen">
      <header className="productsscreen-header">
      <h1>Productos</h1>

      </header>
      <aside className="productsscreen-aside">
      <Tabs
      defaultActiveKey="addProduct"
      id="fill-tab-example"
      className="productsscreen-tabs"
      fill
    >
      <Tab eventKey="addProduct" title="Crear Producto">
       <CreateProduct />
      </Tab>
      <Tab eventKey="addedProducts" title="Productos agregados">
       <ProductsAdded />
      </Tab>

      <Tab eventKey="sellingsProduct" title="Productos vendidos">
        <SellingProducts />
      </Tab>
      <Tab eventKey="pendingProduct" title="Productos pendientes">
        <PendingProducts />
      </Tab>
      <Tab eventKey="cancelledProduct" title="Productos Cancelados">
        <CancelledProducts />
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
        transition: all ease .5s;
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
    
    
    
    .nav-tabs .nav-item.show{
        border: #EC3337 1px solid;
        display: grid;
    }
  
`