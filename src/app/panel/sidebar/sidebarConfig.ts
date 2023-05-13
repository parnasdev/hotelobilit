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
    { name: 'داشبورد', icon: '', link: '/panel', show: true,permition:'', children: [] },
    {
        name: 'هتل و شهر', icon: '', link: '/panel',permition:'hotels', show: true, children: [
            { name: 'لیست هتل ها',permition:'hotels.read', link: '/panel/hotel', show: true },
            { name: 'افزودن هتل',permition:'hotels.create', link: '/panel/hotel/add', show: true },
            { name: 'لیست شهر ها',permition:'cities.read', link: '/panel/cities', show: true },
            { name: 'افزودن شهر',permition:'cities.create', link: '/hotel/cities/set', show: true },
        ]
    },
    {
        name: 'پرواز ها', icon: '', link: '#', permition:'flights',show: true, children: [
            { name: 'لیست مسیر پرواز ها',permition:'flights.read', link: '/panel/transferRate', show: true },
            { name: 'افزودن مسیر پرواز',permition:'flights.create', link: '/panel/transferRate/add', show: true },
            { name: 'لیست ایرلاین ها',permition:'airlines.read', link: '/panel/transfer', show: true },
            { name: 'افزودن ایرلاین',permition:'airlines.create', link: '/panel/transfer/add', show: true },
            { name: 'لیست فرودگاه ها',permition:'cities.read', link: '/panel/airport', show: true },
            { name: 'افزودن فرودگاه',permition:'cities.create', link: '/panel/airport/add', show: true },
        ]
    },
    { name: 'کاربران', icon: '', link: '/panel/user', show: true,permition:'users', children: [] },

]