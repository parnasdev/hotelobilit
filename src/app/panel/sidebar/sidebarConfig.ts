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
    { name: 'داشبورد', icon: '', link: '/panel', show: true, permition: '', children: [] },
    { name: 'هتل ها', icon: '', link: '/panel/hotel', permition: 'hotels.read', show: true, children: []},
    { name: 'پکیج ها', icon: '', link: '/panel/packages', permition: '', show: true, children: []},

    { name: 'پروازها', icon: '', link: '/panel/transferRate', permition: 'flights.read', show: true, children: []},
    { name: 'گزارشات', icon: '', link: '/panel/reserves', show: true, permition: 'reserves.read', children: [] },
    { name: 'مالی', icon: '', link: '/panel/financial', show: true, permition: 'users', children: [] },
    { name: 'کاربران', icon: '', link: '/panel/user', show: true, permition: 'users.read', children: [] },
    { name: 'امکانات پایه', icon: '', link: '', show: true, permition: '', children: [
            { name: 'نرخ گذاری ارز', permition: '', link: '/panel/setCurrencyRate', show: true },
            { name: 'اتاق ها', permition: 'rooms.read', link: '/panel/rooms', show: true },
            { name: 'امکانات هتل', permition: 'services.read', link: '/panel/facilities', show: true },
            { name: 'خدمات', permition: 'service.read', link: '/panel/services', show: true },
            { name: 'شهر ها و کشور ها', permition: 'cities.read', link: '/panel/cities', show: true },
            { name: 'ایرلاین ها', permition: 'airlines.read', link: '/panel/transfer', show: true },
            { name: 'فرودگاه ها', permition: 'airlines.read', link: '/panel/airport', show: true },
        ]
    },
]