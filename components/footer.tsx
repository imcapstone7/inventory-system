"use client";

const Footer = () => {
    return (
        <div className="border-t">
            <div className="mx-auto py-10 w-96 flex flex-col gap-2 justify-center">
                <p className="text-center text-xs">
                    This is the Partial Capstone Project of Institute of Computer Studies &quot;INVENTORY MONITORING SYSTEM USING PREDICTIVE ANALYSIS FOR GENERAL SERVICES DEPARTMENT OF PHILIPPINE STATE COLLEGE OF AERONAUTICS&quot;
                </p>
                <p className="flex flex-col justify-center text-center text-xs">
                    <div className="mb-2">
                        Members:
                    </div>
                    <div className="font-bold">
                        Abatayo, Sophia Grace D.
                    </div>
                    <div className="font-bold">
                        Buenaobra, Jhanelle C.
                    </div>
                    <div className="font-bold">
                        Noilan, Julius S.
                    </div>
                </p>
                <p className="flex flex-col justify-center text-center text-xs">
                    <div className="mb-2">
                        S.Y 2024
                    </div>
                    <div>
                        Philippine State College of Aeronautics
                    </div>
                    <div>
                        Capstone Adviser: Dr. <span className="font-bold">Jerum B. Dasalla</span>
                    </div>
                    <div>
                        Academic Capstone Adviser - Assoc. Prof. <span className="font-bold">Mary Ann F. Aballiar-Vista</span>, MEAM
                    </div>
                </p>
            </div>
        </div>
    )
}

export default Footer;