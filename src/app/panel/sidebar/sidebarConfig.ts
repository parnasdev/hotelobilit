export interface SidebarDTO {
    name: string;
    icon: string;
    link: string;
    show: boolean;
    permition: string;
    children: {
        name: string;
        link: string;
        permition: string
        show: boolean;
    }[]
}
export const Sidebar: SidebarDTO[] = [
    { name: 'dashboard', icon: '../../../assets/img/panel/icons/dashboard.png', link: '/panel', show: true, permition: '', children: [] },
    { name: 'hotels', icon: '../../../assets/img/panel/icons/hotel.png', link: '/panel/hotel', permition: 'hotels.read', show: true, children: []},
    { name: 'packages', icon: '../../../assets/img/panel/icons/pages.png', link: '/panel/packages', permition: 'tours.read', show: true, children: []},
    // { name: 'flights', icon: '../../../assets/img/panel/icons/airport2.png', link: '/panel/transferRate', permition: 'flights.read', show: true, children: []},
    { name: 'new flights', icon: '../../../assets/img/panel/icons/airport2.png', link: '/panel/flight', permition: 'flights.read', show: true, children: []},
    { name: 'reports', icon: '../../../assets/img/panel/icons/reserve.png', link: '/panel/reserves', show: true, permition: 'reserves.read', children: [] },
    { name: 'financial', icon: '', link: '/panel/financial', show: true, permition: 'users', children: [] },
    { name: 'users', icon: '../../../assets/img/panel/icons/users.png', link: '/panel/user', show: true, permition: 'users.read', children: [] },
    { name: 'baseOptions', icon: '', link: '', show: true, permition: '', children: [
            { name: 'CurrencyPricing', permition: 'settings.read', link: '/panel/setCurrencyRate', show: true },
            { name: 'rooms', permition: 'rooms.read', link: '/panel/rooms', show: true },
            { name: 'hotelOptions', permition: 'services.read', link: '/panel/facilities', show: true },
            { name: 'services', permition: 'service.read', link: '/panel/services', show: true },
            { name: 'citiesAndCuntries', permition: 'cities.read', link: '/panel/cities', show: true },
            { name: 'airlines', permition: 'airlines.read', link: '/panel/transfer', show: true },
            { name: 'airplanes', permition: 'airlines.read', link: '/panel/airplane', show: true },

            { name: 'airports', permition: 'airlines.read', link: '/panel/airport', show: true },
        ]
    },
]