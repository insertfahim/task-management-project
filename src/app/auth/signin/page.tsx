import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8">
                {/* Demo Account Banner */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg
                            className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div className="text-sm text-indigo-700 dark:text-indigo-300">
                            <p className="font-medium">Try the demo account!</p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400">
                                Explore all features with sample data
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Or{" "}
                        <a
                            href="/auth/signup"
                            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            create a new account
                        </a>
                    </p>
                </div>
                <SignInForm />
            </div>
        </div>
    );
}
