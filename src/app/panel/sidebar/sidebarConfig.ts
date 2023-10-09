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
    { name: 'dashboard', icon: '', link: '/panel', show: true, permition: '', children: [] },
    { name: 'hotels', icon: '', link: '/panel/hotel', permition: 'hotels.read', show: true, children: []},
    { name: 'packages', icon: '', link: '/panel/packages', permition: '', show: true, children: []},

    { name: 'flights', icon: '', link: '/panel/transferRate', permition: 'flights.read', show: true, children: []},
    { name: 'reports', icon: '', link: '/panel/reserves', show: true, permition: 'reserves.read', children: [] },
    { name: 'financial', icon: '', link: '/panel/financial', show: true, permition: 'users', children: [] },
    { name: 'users', icon: '', link: '/panel/user', show: true, permition: 'users.read', children: [] },
    { name: 'baseOptions', icon: '', link: '', show: true, permition: '', children: [
            { name: 'CurrencyPricing', permition: '', link: '/panel/setCurrencyRate', show: true },
            { name: 'rooms', permition: 'rooms.read', link: '/panel/rooms', show: true },
            { name: 'hotelOptions', permition: 'services.read', link: '/panel/facilities', show: true },
            { name: 'services', permition: 'service.read', link: '/panel/services', show: true },
            { name: 'citiesAndCuntries', permition: 'cities.read', link: '/panel/cities', show: true },
            { name: 'airlines', permition: 'airlines.read', link: '/panel/transfer', show: true },
            { name: 'airports', permition: 'airlines.read', link: '/panel/airport', show: true },
        ]
    },
]