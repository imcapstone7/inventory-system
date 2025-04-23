import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { database } from "@/firebase";
import { ref, set } from "firebase/database";
import Bowser from "bowser";
import useSession from "@/hook/use-session";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { User, getAuth, signOut } from "firebase/auth";
import { app } from "@/firebase";

interface OtpProps {
    userId: string;
    email: string;
    password: string;
    user: User;
}

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
});

const Otp: React.FC<OtpProps> = ({
    userId,
    email,
    password,
    user,
}) => {
    const auth = getAuth(app);

    const router = useRouter();
    const { tabValue, setTabValue, loading, setLoading } = useSession();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
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
        return uuidv4().replace(/-/g, "").substring(0, 11);
    }

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            setLoading(true);

            const otp = data.pin;

            const response = await axios.post("/api/verifyOtp", { userId, otp });
            if (response.data.status === 200) {
                const response = await axios.post("/api/session", { email, password, user });

                if (response.data.status === 200) {
                    const OS = getOSName();
                    const Browser = getBrowserName();

                    await set(ref(database, `users/${response.data.id}/history/${generateShortUUID()}`), {
                        osUsed: OS,
                        browserUsed: Browser,
                        createdAt: Date.now(),
                    });

                    setTabValue("login");
                    router.push("/dashboard-page");
                }
            } else {
                console.log("Invalid or expired OTP.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Run signOut when the component unmounts (user navigates away or closes the page)
        return () => {
            signOut(auth)
                .then(() => console.log("User signed out"))
                .catch((error) => console.error("Error signing out:", error));
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex justify-center items-center w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-2xl font-bold">One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription className="text-lg">
                                        Please enter the one-time password sent to your phone.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Otp;
