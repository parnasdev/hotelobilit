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
        name: 'هتل و شهر', icon: '', link: '/panel',permition:'', show: true, children: [
            { name: 'لیست هتل ها',permition:'Hotel.read', link: '/panel/hotel', show: true },
            { name: 'افزودن هتل',permition:'Hotel.create', link: '/panel/hotel/add', show: true },
            { name: 'لیست شهر ها',permition:'City.read', link: '/hotel/cities', show: true },
            { name: 'افزودن شهر',permition:'City.create', link: '/hotel/cities/set', show: true },
        ]
    },
    {
        name: 'پرواز ها', icon: '', link: '#', permition:'Transfer',show: true, children: [
            { name: 'لیست مسیر پرواز ها',permition:'Transfer.read', link: '/panel/transferRate', show: true },
            { name: 'افزودن مسیر پرواز',permition:'Transfer.create', link: '/panel/transferRate/add', show: true },
            { name: 'لیست ایرلاین ها',permition:'Transfer.read', link: '/panel/transfer', show: true },
            { name: 'افزودن ایرلاین',permition:'Transfer.create', link: '/panel/transfer/add', show: true },
        ]
    },
]