import logo from "./images/logo.png";
import userDefaultPhoto from "./images/user_icon.png";
import worldIcon from "./images/world.png";
import heroImg1 from "./images/hero-img01.jpg";
import heroImg2 from "./images/hero-img02.jpg";
import experiance from "./images/travel-exp.jpg";
import person from "./images/person.jpg";
import tourist from "./images/male-tourist.png";
import about from "./images/airport.jpg";
import contact from "./images/contact.gif";
import travel1 from "./images/travel-exp.jpg";
import travel2 from "./images/traveling.jpg";

import heroVideo from "./videos/hero-video.mp4";

export const images = {
  userDefaultPhoto,
  logo,
  worldIcon,
  heroImg1,
  heroImg2,
  experiance,
  person,
  tourist,
  about,
  contact,
  travel1,
  travel2,
};

export const videos = { heroVideo };

export const tours = [
  {
    id: 1,
    featured: true,
    location: "Darjeeling",
    title: "Cultural Heritage Tour of Darjeeling",
    rating: "4.5",
    reviews: "128",
    price: "₹6,000",
    images: [images.heroImg1, images.heroImg2],
    duration: "5 Days",
  },
  {
    id: 2,
    featured: true,
    title: "Historic Mountain Tour of Sikkim   ",
    location: "Sikkim",
    rating: "4.8",
    reviews: "156",
    price: "₹8,000",
    image: images.heroImg1,
    duration: "7 Days",
  },
  {
    id: 3,
    featured: true,
    title: "Buddhist Temple Tour of Gangtok   ",
    location: "Gangtok",
    rating: "4.6",
    reviews: "142",
    price: "₹7,000",
    image: images.heroImg1,
    duration: "6 Days",
  },
  {
    id: 4,
    featured: true,
    title: "Royal Heritage Tour of Kalimpong  ",
    location: "Kalimpong",
    rating: "4.7",
    reviews: "98",
    price: "₹5,500",
    image: images.heroImg1,
    duration: "4 Days",
  },
  {
    id: 5,
    featured: true,
    title: "Lakeside Retreat Tour of Mirik    ",
    location: "Mirik",
    rating: "4.4",
    reviews: "85",
    price: "₹4,500",
    image: images.heroImg1,
    duration: "3 Days",
  },
  {
    id: 6,
    featured: true,
    title: "Tea Garden Explorer of Kurseong   ",
    location: "Kurseong",
    rating: "4.6",
    reviews: "112",
    price: "₹5,000",
    image: images.heroImg1,
    duration: "4 Days",
  },
  {
    id: 7,
    featured: true,
    title: "Ancient Monastery Tour of Pelling ",
    location: "Pelling",
    rating: "4.7",
    reviews: "134",
    price: "₹6,500",
    image: images.heroImg1,
    duration: "5 Days",
  },
  {
    id: 8,
    featured: true,
    title: "Sacred Buddha Tour of Ravangla    ",
    location: "Ravangla",
    rating: "4.5",
    reviews: "92",
    price: "₹5,800",
    image: images.heroImg1,
    duration: "4 Days",
  },
  {
    id: 9,
    featured: true,
    title: "Valley Discovery Tour of Lachung  ",
    location: "Lachung",
    rating: "4.8",
    reviews: "167",
    price: "₹9,000",
    image: images.heroImg1,
    duration: "6 Days",
  },
  {
    id: 10,
    featured: true,
    title: "Traditional Culture Tour of Namchi ",
    location: "Namchi",
    rating: "4.4",
    reviews: "78",
    price: "₹5,200",
    image: images.heroImg1,
    duration: "3 Days",
  },
  {
    id: 11,
    featured: true,
    title: "Scenic Valley Tour of Yumthang    ",
    location: "Yumthang",
    rating: "4.9",
    reviews: "189",
    price: "₹10,000",
    image: images.heroImg1,
    duration: "7 Days",
  },
  {
    id: 12,
    featured: true,
    title: "Historic Silk Route Tour of Zuluk  ",
    location: "Zuluk",
    rating: "4.7",
    reviews: "145",
    price: "₹7,500",
    image: images.heroImg1,
    duration: "5 Days",
  },
];

export const countries = [
  {
    name: "India",
    states: [
      {
        name: "Maharashtra",
        districts: [
          {
            name: "Mumbai",
            cities: [
              { name: "Mumbai City", touristPlace: ["Gateway of India", "Marine Drive"] },
              { name: "Navi Mumbai", touristPlace: ["Palm Beach Road", "DY Patil Stadium"] }
            ]
          },
          {
            name: "Pune",
            cities: [
              { name: "Pune City", touristPlace: ["Shaniwar Wada", "Aga Khan Palace"] },
              { name: "Pimpri-Chinchwad", touristPlace: ["Appu Ghar", "Science Park"] }
            ]
          },
          {
            name: "Nagpur",
            cities: [
              { name: "Nagpur City", touristPlace: ["Deekshabhoomi", "Futala Lake"] },
              { name: "Hingna", touristPlace: [] }
            ]
          }
        ]
      },
      {
        name: "Karnataka",
        districts: [
          {
            name: "Bangalore",
            cities: [
              { name: "Bangalore Urban", touristPlace: ["Lalbagh Garden", "Cubbon Park"] },
              { name: "Electronic City", touristPlace: ["Infosys Campus", "Hosur Road"] }
            ]
          },
          {
            name: "Mysore",
            cities: [
              { name: "Mysore City", touristPlace: ["Mysore Palace", "Brindavan Gardens"] },
              { name: "Nanjangud", touristPlace: ["Nanjundeshwara Temple"] }
            ]
          }
        ]
      },
      {
        name: "Bihar",
        districts: [
          {
            name: "Patna",
            cities: [
              { name: "Patna City", touristPlace: ["Golghar", "Patna Sahib Gurudwara"] }
            ]
          },
          {
            name: "East Champaran",
            cities: [
              { name: "Motihari", touristPlace: ["Golghar", "Patna Sahib Gurudwara"] },
              { name: "Ghorasahan", touristPlace: ["Golghar", "Patna Sahib Gurudwara"] }
            ]
          },
          {
            name: "Gaya",
            cities: [
              { name: "Gaya City", touristPlace: ["Mahabodhi Temple", "Vishnupad Temple"] }
            ]
          },
          {
            name: "Muzaffarpur",
            cities: [
              { name: "Muzaffarpur City", touristPlace: ["Baba Garibnath Temple", "Litchi Gardens"] }
            ]
          }
        ]
      }
    ]
  }
];