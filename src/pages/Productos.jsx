import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDatosPublic } from "../context/DatosPublicContext";
import { ProductoCard } from "../components/Products/Producto-Card";
import { Link, useLocation, useParams } from "react-router-dom";
import { LateralFilter } from "../components/Ui/LateralFilter";
import { LoadingSpinner } from "../components/Windows/LoadingSpinner";

const Productos = () => {
  const location = useLocation();
  const { productos, cargando, descuentos, categorias } = useDatosPublic();
  const { categoria } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const [valorInput, setValorInput] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const productosMainRef = useRef(null);

  useEffect(() => {
    if (productos.length > 0) {
      setProductosFiltrados(productos);
    }
  }, [productos, location]);

  const filtrar = (param, valor, mayor) => {
    let nuevaLista = productos;
    if (param === "canjeables") {
      nuevaLista = productos.filter((producto) => producto.valor_en_puntos > 0);
    } else if (param === "categorias") {
      nuevaLista = productos.filter((producto) => producto.categoria === valor);
    } else if (param === "tipos") {
      nuevaLista = productos.filter((producto) => producto.tipo === valor);
    } else if (param === "marcas") {
      nuevaLista = productos.filter((producto) => producto.marca === valor);
    } else if (param === "atributos") {
      const { nombre, valor: valorAtributo } = valor;
      nuevaLista = productos.filter((producto) =>
        producto.producto_atributos.some(
          (attr) => attr.atributo.nombre === nombre && attr.atributo.valor.toLowerCase() === valorAtributo.toLowerCase()
        )
      );
    } else if (param === "modelos") {
      nuevaLista = productos.filter((producto) => producto.modelo_talle === valor);
    } else if (param === "precios") {
      nuevaLista = productos.filter(
        (producto) =>
          producto.precio_final >= valor && producto.precio_final <= mayor
      );
    } else if (param === "descuentos") {
      const categoriasEnDescuento = categorias.filter((categoria) =>
        descuentos.some((descuento) => descuento.categoria === categoria.id)
      );
      nuevaLista = productos.filter((producto) =>
        categoriasEnDescuento.some((cat) => cat.id === producto.categoria)
      );
    }
    setProductosFiltrados(nuevaLista);
  };

  const ordenarSegun = (param) => {
    let nuevaLista = [...productosFiltrados];
    if (param === "mayor precio") {
      nuevaLista.sort((a, b) => b.precio_final - a.precio_final);
    } else if (param === "menor precio") {
      nuevaLista.sort((a, b) => a.precio_final - b.precio_final);
    } else if (param === "mas vendidos") {
      nuevaLista.sort((a, b) => {
        return b.cantidad_vendida_total - a.cantidad_vendida_total;
      });
    } else if (param === "mas nuevos") {
      nuevaLista.sort((a, b) => {
        return (
          new Date(b.fecha_publicacion || 0).getTime() -
          new Date(a.fecha_publicacion || 0).getTime()
        );
      });
    } else if (param === "mas antiguos") {
      nuevaLista.sort((a, b) => {
        return (
          new Date(a.fecha_publicacion || 0).getTime() -
          new Date(b.fecha_publicacion || 0).getTime()
        );
      });
    }
    setProductosFiltrados(nuevaLista);
  };

  const resetFiltros = () => {
    setProductosFiltrados([...productos]);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const toggleMenuOrden = () => {
    setIsOpenOrder((prev) => !prev);
  };

  const idObject = (object, param) => {
    if (!object.length) return null;
    const objId = object.find((obj) => param === obj.nombre);
    return objId ? objId.id : null; // Devolver el ID, no el nombre
  };

  const productosSegunCat = () => {
    if (!categoria) return productosFiltrados;
    const categoriaId = idObject(categorias, categoria);
    return productosFiltrados.filter((producto) => {
      const matchesCategoria =
        categoriaId && producto.categoria === categoriaId;
      return matchesCategoria;
    });
  };

  const productosFinales = productosSegunCat();
  const productosBuscados =
    valorInput !== ""
      ? productosFinales.filter((producto) =>
        producto.nombre
          .toLocaleLowerCase()
          .includes(valorInput.toLocaleLowerCase())
      )
      : productosFinales;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productosBuscados.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productosBuscados.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (productosMainRef.current) {
      const offsetTop =
        productosMainRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: offsetTop - 20, behavior: "smooth" });
    }
  };

  return (
    <div className="productos-container">
      {cargando && <LoadingSpinner />}
      <header className="productos-header">
        <h1>Catálogo de Productos{categoria ? ` - ${categoria}` : ""}</h1>
        <div className="search-all-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={valorInput}
              onChange={(e) => setValorInput(e.target.value)}
              aria-label="Buscar productos"
            />
            <button className="search-btn" aria-label="Buscar">
              <i className="bi bi-search"></i>
            </button>
          </div>
          {categoria && (
            <Link
              to={"/productos-listado"}
              className="all-btn"
              aria-label="Ver todo"
            >
              VER TODO
            </Link>
          )}
        </div>
      </header>

      <div className="productos-main" ref={productosMainRef}>
        <div className="section-filter">
          <button
            className="button-filter"
            onClick={toggleSidebar}
            aria-label=""
          >
            <i className="bi bi-funnel"></i>
            <span>Filtros</span>
          </button>

          <div className="sort-container">
            <button
              className="button-filter"
              onClick={toggleMenuOrden}
              aria-label="Opciones de ordenamiento"
            >
              <i className="bi bi-sort-down"></i>
              <span>Ordenar</span>
            </button>

            {isOpenOrder && (
              <div className="menu-order">
                {[
                  { label: "Más vendidos", value: "mas vendidos" },
                  { label: "Mayor precio", value: "mayor precio" },
                  { label: "Menor precio", value: "menor precio" },
                  { label: "Más nuevos", value: "mas nuevos" },
                  { label: "Más antiguos", value: "mas antiguos" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      ordenarSegun(option.value);
                      setIsOpenOrder(false);
                    }}
                    className="sort-option"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="products-count">
            {productosBuscados.length} productos
          </div>
        </div>

        <div className="productos-all">
          {currentProducts.length > 0 ? (
            currentProducts.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))
          ) : (
            !cargando && (
              <div className="no-products">No se encontraron productos</div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
              aria-label="Página anterior"
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""
                  }`}
                aria-label={`Página ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
              aria-label="Página siguiente"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
      <LateralFilter
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        filtrar={filtrar}
        reset={resetFiltros}
      />
    </div>
  );
};

export default Productos;