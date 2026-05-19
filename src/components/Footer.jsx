export default function Footer() {
  return (
    <footer className="footer-roluad">
      <div className="container">

        <div className="row g-4">

          <div className="col-md-3">
            <h5>Sobre ROLUAD</h5>

            <a href="#">Catálogo del mes</a>
            <a href="#">Boticas 24 horas</a>
            <a href="#">Productos equivalentes</a>
            <a href="#">Promociones online</a>
            <a href="#">Términos y condiciones</a>
          </div>

          <div className="col-md-3">
            <h5>ROLUAD Digital</h5>

            <a href="#">Blog de salud</a>
            <a href="#">Retiro en tienda</a>
            <a href="#">Zonas de cobertura</a>
            <a href="#">Comprobante electrónico</a>
            <a href="#">Política de privacidad</a>
          </div>

          <div className="col-md-3">
            <h5>Contáctanos</h5>

            <a href="#">Preguntas frecuentes</a>
            <a href="#">Información médica</a>
            <a href="#">Trabaja con nosotros</a>

            <div className="footer-contact mt-3">
              <strong>Roluadfono (Lima)</strong>
              <span>(511) 314 2020</span>
            </div>
          </div>

          <div className="col-md-3">
            <h5>Síguenos</h5>

            <div className="footer-social">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="footer-book mt-4">
              <div className="book-icon"></div>

              <div>
                <strong>Libro de</strong>
                <p>Reclamaciones</p>
              </div>
            </div>

            <div className="footer-app mt-4">
              <h6>Descarga nuestra App</h6>

              <div className="app-buttons">
                <button>Google Play</button>
                <button>App Store</button>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Botica ROLUAD - Todos los derechos reservados</span>
          <span>Ecommerce académico desarrollado en React + Node.js</span>
        </div>

      </div>
    </footer>
  )
}