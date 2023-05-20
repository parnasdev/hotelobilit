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
    { name: 'هتل ها', icon: '', link: '/panel/hotel', permition: 'hotels', show: true, children: []},
    { name: 'پروازها', icon: '', link: '/panel/transferRate', permition: 'flights', show: true, children: []},
    { name: 'گزارشات', icon: '', link: '/panel/reports', show: true, permition: 'users', children: [] },
    { name: 'مالی', icon: '', link: '/panel/financial', show: true, permition: 'users', children: [] },
    { name: 'کاربران', icon: '', link: '/panel/user', show: true, permition: 'users', children: [] },
    { name: 'امکانات پایه', icon: '', link: '', show: true, permition: 'settings', children: [
            { name: 'نرخ گذاری ارز', permition: 'settings', link: '/panel/setCurrencyRate', show: true },
            { name: 'نرخ گذاری خدمات', permition: 'settings', link: '/panel/setServiceRate', show: true },
            { name: 'اتاق ها', permition: 'RoomTypes', link: '/panel/rooms', show: true },
            { name: 'امکانات هتل', permition: 'RoomTypes', link: '/panel/service', show: true },
            { name: 'شهر ها و کشور ها', permition: 'cities.read', link: '/panel/cities', show: true },
            { name: 'ایرلاین ها', permition: 'airlines.read', link: '/panel/transfer', show: true },
            { name: 'فرودگاه ها', permition: 'cities.read', link: '/panel/airport', show: true },
        ]
    },

]