import { getFile } from "../../../../globalActions";

export const ClothingScreen = () => {
  return (
    <section className="productscreen">
      <h1>Servicios</h1>
      <div className="productscreen-contain">
        <div className="productscreen-contain-services">
          <img src={getFile("svg", "devapps", "svg")} alt="" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis,
            quibusdam assumenda consequuntur perferendis reiciendis sint porro
            voluptatem neque sapiente? Reiciendis natus quod laudantium amet id
            sunt sint omnis repellendus voluptates.
          </p>
        </div>
        <div className="productscreen-contain-services">
          <img src={getFile("svg", "graphic-design", "svg")} alt="" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis,
            quibusdam assumenda consequuntur perferendis reiciendis sint porro
            voluptatem neque sapiente? Reiciendis natus quod laudantium amet id
            sunt sint omnis repellendus voluptates.
          </p>
        </div>
      </div>
    </section>
  );
};
