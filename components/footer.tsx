"use client";

const Footer = () => {
    return (
        <div className="border-t">
            <div className="mx-auto py-10 w-96 flex flex-col gap-2 justify-center">
                <p className="text-center text-xs">
                    This is the Partial Capstone Project of Institute of Computer Studies &quot;INVENTORY MONITORING SYSTEM USING PREDICTIVE ANALYSIS FOR GENERAL SERVICES DEPARTMENT OF PHILIPPINE STATE COLLEGE OF AERONAUTICS&quot;
                </p>
                <div className="text-center text-xs">
                    <p className="mb-2">Members:</p>
                    <p className="font-bold">Abatayo, Sophia Grace D.</p>
                    <p className="font-bold">Buenaobra, Jhanelle C.</p>
                    <p className="font-bold">Noilan, Julius S.</p>
                </div>
                <div className="text-center text-xs">
                    <p className="mb-2">S.Y 2024</p>
                    <p>Philippine State College of Aeronautics</p>
                    <p>
                        Capstone Adviser: Dr. <span className="font-bold">Jerum B. Dasalla</span>
                    </p>
                    <p>
                        Academic Capstone Adviser - Assoc. Prof.{" "}
                        <span className="font-bold">Mary Ann F. Aballiar-Vista</span>, MEAM
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
