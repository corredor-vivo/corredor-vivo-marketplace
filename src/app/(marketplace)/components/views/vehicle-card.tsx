
import { VehicleModel } from "../../models/vehicle"
import { AvatarFallback, Avatar, AvatarImage } from "~/components/ui/avatar"
import { getAcronim } from "~/app/panel/components/navigation/profile"

type Props = {
    vehicle: VehicleModel
    active: boolean
    onSelect: (vehicle: VehicleModel) => void
}

export function VehicleCard({ vehicle, active, onSelect }: Props) {
    const fullName = `${vehicle.owner.firstName} ${vehicle.owner.lastName}`

    return (
        <div
            className={`flex gap-4 rounded-md border p-4 shadow transition-colors cursor-pointer  ${active
                ? "outline outline-2 outline-emerald-700 "
                : "bg-background"
                }`}
            onClick={() => onSelect(vehicle)}
        >
            <div>
                <Avatar>
                    <AvatarImage
                        src={vehicle.owner.photo ?? "https://github.com/shadcn.png"}
                        alt={fullName}
                    />
                    <AvatarFallback>
                        {getAcronim(fullName)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-medium">
                        {fullName}
                    </h3>

                    <p
                        className={

                            "text-sm text-muted-foreground"
                        }
                    >
                        {vehicle.name}
                    </p>

                    <p
                        className={

                            "text-sm font-semibold text-muted-foreground"
                        }
                    >
                        {vehicle.license_plate}
                    </p>
                </div>

            </div>
        </div>
    )
}