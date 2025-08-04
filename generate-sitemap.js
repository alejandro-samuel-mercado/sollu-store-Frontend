const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");
const path = require("path");
const axios = require("axios");

const frontendHostname = "https://sollu-store.communnay.online";  // Frontend
const backendHostname = "https://api-tiendasol.communnay.online"; // Backend

async function fetchProductUrls() {
  try {
    if (!frontendHostname || !backendHostname) {
      throw new Error("❌ Error: hostname no está definido.");
    }

    // Utiliza el backend para obtener los datos de productos y categorías
    const productosUrl = `${backendHostname}/api/productos`;  // API de productos en el backend
    const categoriasUrl = `${backendHostname}/api/categorias`;  // API de categorías en el backend

    console.log(`🔄 Obteniendo productos desde: ${productosUrl}`);
    console.log(`🔄 Obteniendo categorías desde: ${categoriasUrl}`);

    const { data: productos } = await axios.get(productosUrl);
    const { data: categorias } = await axios.get(categoriasUrl);

    const pages = [
      "/", "/contacto", "/info-page", "/about-us", "/terminos-politicas",
      "/MiCarrito", "/categorias", "/login", "/register", "/Mi-cuenta",
      "/productos-listado", "/pago-fallido", "/pago-exitoso"
    ];

    // Agrega los productos dinámicos
    productos.forEach((producto) => {
      pages.push(`/productos-listado/producto/${producto.id}`);
    });

    // Agrega las categorías dinámicas
    categorias.forEach((categoria) => {
      pages.push(`/productos-listado/categorias/${categoria.nombre}`);
    });

    const sitemap = new SitemapStream({ hostname: frontendHostname }); // Utiliza el hostname del frontend

    pages.forEach((page) => {
      sitemap.write({ url: page, changefreq: "daily", priority: 0.8 });
    });

    sitemap.end();

    const sitemapData = await streamToPromise(sitemap);
    createWriteStream(path.join(__dirname, "public", "sitemap.xml")).write(sitemapData);
    
    console.log("✅ Sitemap generado correctamente en /public/sitemap.xml");
  } catch (error) {
    console.error("❌ Error generando el sitemap:", error.message);
  }
}

fetchProductUrls();
