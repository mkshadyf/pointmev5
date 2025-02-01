import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pointme - Service Booking Platform",
    short_name: "Pointme",
    description: "Book and manage services with ease",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "1170x2532",
        type: "image/png",
        form_factor: "narrow",
        label: "Home Screen",
      },
      {
        src: "/screenshots/services.png",
        sizes: "1170x2532",
        type: "image/png",
        form_factor: "narrow",
        label: "Services Screen",
      },
    ],
    orientation: "portrait",
    categories: ["business", "productivity"],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Book Service",
        short_name: "Book",
        description: "Book a new service",
        url: "/services",
        icons: [{ src: "/icons/book.png", sizes: "192x192" }],
      },
      {
        name: "My Bookings",
        short_name: "Bookings",
        description: "View your bookings",
        url: "/bookings",
        icons: [{ src: "/icons/bookings.png", sizes: "192x192" }],
      },
    ],
  };
}
