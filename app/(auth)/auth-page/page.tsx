"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/controller';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import authPic1 from "@/public/assets/images/philsca-pic-1.jpg";
import authPic2 from "@/public/assets/images/philsca-pic-2.jpg"
import authPic3 from "@/public/assets/images/philsca-pic-3.jpg"
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CircleUserRound, LogIn } from "lucide-react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SignInForm from "@/components/signin-form";
import SignUpForm from "@/components/signup-form";

import { app, database } from "@/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { ref, set } from "firebase/database";
import useSession from "@/hook/use-session";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { createSchema, loginSchema } from "@/lib/types";
import Bowser from "bowser";
import { v4 as uuidv4 } from "uuid";

const auth = getAuth(app);


export default function Page() {

    const { tabValue, setTabValue, loading, setLoading } = useSession();
    const router = useRouter();

    const images = [
        {
            image: authPic1,
            title: "Real-Time Inventory Tracking",
            description: "Streamline your stock management with real-time tracking and automated alerts."
        },
        {
            image: authPic2,
            title: "Automated Reorder Alerts",
            description: "Never run out of stock with automatic alerts when items reach reorder levels."

        },
        {
            image: authPic3,
            title: "Comprehensive Reporting Tools",
            description: "Gain insights with detailed reports on inventory status, usage, and trends."

        }
    ];

    const formLogin = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const form1 = useForm<z.infer<typeof createSchema>>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    function getOSName() {
        const OS = Bowser.getParser(window.navigator.userAgent);
        return OS.getOSName();
    }

    function getBrowserName() {
        const browser = Bowser.getParser(window.navigator.userAgent);
        return browser.getBrowserName();
    }

    function generateShortUUID() {
        return uuidv4().replace(/-/g, '').substring(0, 11);
    }


    const onLogin = async (values: z.infer<typeof loginSchema>) => {
        setLoading(true);
        try {

            const response = await axios.post('/api/session', { values });

            if (response.data.status === 200) {
                const OS = getOSName();
                const Browser = getBrowserName();

                await set(ref(database, `users/${response.data.id}/history/${generateShortUUID()}`), {
                    osUsed: OS,
                    browserUsed: Browser,
                    createdAt: Date.now()
                });

                formLogin.reset();
                setTabValue('login');
                router.push('/dashboard-page');
            }
        } catch (error) {
            console.log(error);
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // const onCreateAccount = async (values: z.infer<typeof createSchema>) => {
    //     setLoading(true);
    //     try {
    //         const response = await createUserWithEmailAndPassword(auth, values.email, values.password);
    //         if (response.user) {
    //             //uid,email,displayName,photoURL,reloadUserInfo:passwordHash,metaData:creationTime,metaData:lastSignInTime
    //             await set(ref(database, 'users/' + response.user.uid), {
    //                 email: response.user.email || '',
    //                 displayName: response.user.displayName || '',
    //                 photoURL: response.user.photoURL || '',
    //                 passwordHash: (response.user as any).reloadUserInfo.passwordHash || '',
    //                 creationTime: response.user.metadata.creationTime || '',
    //                 lastSignInTime: response.user.metadata.lastSignInTime || ''
    //             });

    //             toast.success('User created.');
    //             setTabValue('login');
    //             formLogin.reset();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Something went wrong.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <div className="flex justify-center items-center lg:grid lg:grid-cols-12 h-screen">
            <div className="flex justify-center items-center lg:col-span-6 w-full">
                <div className="flex flex-col justify-center items-center gap-8">
                    <div className="flex justify-end w-full">
                        <ModeToggle />
                    </div>
                    <div className="flex flex-col px-2 mt-6 w-[350px] lg:w-[400px]">
                        <div className="text-2xl font-medium">
                            Welcome back!
                            <span className="ml-1 font-extrabold">User</span>
                        </div>
                        <div className="text-xs text-gray-500 font-semibold">
                            Get into your dashboard
                        </div>
                        <div className="mt-6">
                            <SignInForm form={formLogin} onLogin={onLogin} />
                        </div>
                    </div>
                    {/* <Tabs value={tabValue} className="w-full">
                        <TabsList className="h-14 w-[350px] lg:w-[400px] px-2">
                            <TabsTrigger onClick={() => setTabValue('login')} className="h-10 w-[200px] data-[state=active]:bg-[#020712] data-[state=active]:text-white" value="login"><LogIn className="h-4 w-4 mr-2" /> Login</TabsTrigger>
                            <TabsTrigger onClick={() => setTabValue('create')} className="h-10 w-[200px] data-[state=active]:bg-[#020712] data-[state=active]:text-white" value="create"><CircleUserRound className="h-4 w-4 mr-2" />Create Account</TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex flex-col px-2 mt-6" value="login">
                            <div className="text-2xl font-medium">
                                Welcome back!
                                <span className="ml-1 font-extrabold">User</span>
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">
                                Get into your dashboard
                            </div>
                            <div className="mt-6">
                                <SignInForm form={formLogin} onLogin={onLogin} />
                            </div>
                        </TabsContent>
                        <TabsContent className="flex flex-col px-2 mt-4" value="create">
                            <div className="text-2xl font-medium">
                                Create an account
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">
                                Get into your dashboard
                            </div>
                            <div className="mt-6">
                                <SignUpForm loading={loading} form={form1} onCreateAccount={onCreateAccount} />
                            </div>
                        </TabsContent>
                    </Tabs> */}
                </div>
            </div>
            <div className="col-span-6 hidden lg:block">
                <Swiper
                    modules={[Autoplay, A11y]}
                    slidesPerView={1}
                    autoplay
                >
                    {images.map((item, index) => (
                        <SwiperSlide className="relative" key={index}>
                            <a href='/#'>
                                <Image className="w-full h-screen object-cover" src={item.image} alt={`slide-${index + 1}`} priority />
                            </a>
                            <div className="absolute bottom-0 bg-gradient-to-t from-black h-96 w-full" />
                            <div className="absolute bottom-0 p-4 space-y-6">
                                <Badge variant={"secondary"}>{item.title}</Badge>
                                <div className="text-white font-semibold text-2xl">
                                    {item.description}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}
