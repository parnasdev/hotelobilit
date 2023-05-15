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
    { name: 'اتاق ها', icon: '', link: '/panel/rooms', permition: 'RoomType', show: true, children: []}
    // [
    // { name: 'لیست هتل ها',permition:'hotels.read', link: '/panel/hotel', show: true },
    // { name: 'افزودن هتل',permition:'hotels.create', link: '/panel/hotel/add', show: true },
    // { name: 'افزودن کشور و شهر',permition:'cities.create', link: '/panel/cities/add', show: true },
    // ]
    // },
    ,{
        name: 'مسیرها و پروازها', icon: '', link: '/panel/transferRate', permition: 'flights', show: true, children: []},
            // { name: 'لیست مسیر پرواز ها', permition: 'flights.read', link: '/panel/transferRate', show: true },
            // { name: 'افزودن مسیر پرواز', permition: 'flights.create', link: '/panel/transferRate/add', show: true },
            // { name: 'افزودن ایرلاین', permition: 'airlines.create', link: '/panel/transfer/add', show: true },
            // { name: 'افزودن فرودگاه', permition: 'cities.create', link: '/panel/airport/add', show: true },
    //     ]
    // },
    { name: 'کاربران', icon: '', link: '/panel/user', show: true, permition: 'users', children: [] },

    {
        name: 'امکانات پایه', icon: '', link: '', show: true, permition: 'settings', children: [
            { name: 'نرخ گذاری ارز', permition: 'settings', link: '/panel/setCurrencyRate', show: true },
            { name: 'نرخ گذاری خدمات', permition: 'settings', link: '/panel/setServiceRate', show: true },
            { name: 'شهر ها و کشور ها', permition: 'cities.read', link: '/panel/cities', show: true },
            { name: 'ایرلاین ها', permition: 'airlines.read', link: '/panel/transfer', show: true },
            { name: 'فرودگاه ها', permition: 'cities.read', link: '/panel/airport', show: true },

        ]
    },

]