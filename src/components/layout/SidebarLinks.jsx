import { RobotOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { FaBox } from 'react-icons/fa';

const SidebarLinks = () => [
  {
    label: "Usuarios",
    icon: <TeamOutlined />,
    subMenu: [
      {
        label: "Administrar Perfil",
        to: "/perfil",
      },
      {
        label: "Administrar roles",
        to: "/roles",
      },
      {
        label: "Asignar permisos",
        to: "/permisos",
      },
      {
        label: "Administrar usuarios",
        to: "/adminUsers",
      },
    ],
  },
  {
    label: "Productos",
    icon: <FaBox />,
    subMenu: [
      {
        label: "Gestionar Categoria",
        to: "/categoria",
      },
      {
        label: "Gestionar Categorias de Colores",
        to: "/categoria_color",
      },
      {
        label: "Gestionar Color",
        to: "/color",
      },
      {
        label: "Gestionar Talla",
        to: "/talla",
      },
      {
        label: "Gestionar Marca",
        to: "/marca",
      },
      {
        label: "Gestionar Producto",
        to: "/producto",
      }
    ],
  },
  {
    label: "Inventario",
    icon: <SettingOutlined />,
    subMenu: [
      {
        label: "Notas de ingreso",
        to: "/notaIngreso",
      },
      {
        label: "Notas de venta",
        to: "/ventas",
      }
      /* REPORTES COMENTADOS HASTA QUE ESTÉ EL MICROSERVICIO DE DASHBOARDS
      {
        label: "Productos bajo stock",
        to: "/productos-bajo-stock",
      },
      {
        label: "Reporte de inventario",
        to: "/reporte-inventario",
      }
      */
    ],
  },
  /* SECCIÓN DE REPORTES - DESCOMENTAR CUANDO ESTÉ EL MICROSERVICIO
  ,{
    label: "Reportes y Estadísticas",
    icon: <FileAddOutlined />,
    subMenu: [
      {
        label: "Dashboard general",
        to: "/dashboard",
      },
      {
        label: "Reporte de ventas",
        to: "/reporte-ventas",
      },
      {
        label: "Productos más vendidos",
        to: "/productos-mas-vendidos",
      },
      {
        label: "Clientes activos",
        to: "/clientes-activos",
      }
    ],
  }
  */
  {
    label: "Inteligencia Artificial",
    icon: <RobotOutlined />,
    subMenu: [
      {
        label: "Clasificar Imágenes",
        to: "/clasificar-imagen",
      }
      // Puedes agregar más opciones de IA aquí después
    ],
  },
  {
    label: "Dashboard de Métricas",
    icon: <RobotOutlined />,
    subMenu: [
      {
        label: "Metricas",
        to: "/metrics",
      }
      // Puedes agregar más opciones de IA aquí después
    ],
  }
];

export default SidebarLinks;
