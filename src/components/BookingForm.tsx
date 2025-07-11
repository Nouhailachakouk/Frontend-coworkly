import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Users, Clock, MapPin, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { spaceTypes, timeSlots } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function BookingForm() {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    spaceType: "",
    attendees: "",
    startTime: "",
    endTime: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !formData.spaceType || !formData.startTime || !formData.endTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8081/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceType: formData.spaceType,
          date: date ? format(date, "yyyy-MM-dd") : null,
          startTime: formData.startTime,
          endTime: formData.endTime,
          attendees: Number(formData.attendees) || 1,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la réservation");
      }

      toast({
        title: "Réservation confirmée !",
        description: `Votre ${formData.spaceType.toLowerCase()} est réservé pour le ${format(date, 'dd MMMM yyyy', { locale: fr })}.`,
      });

      // Reset du formulaire
      setDate(undefined);
      setFormData({
        spaceType: "",
        attendees: "",
        startTime: "",
        endTime: "",
        notes: ""
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: (error as Error).message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4">
      <Card className="shadow-xl border-0 gradient-card p-10 min-h-[700px]">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-900 bg-clip-text text-transparent">
            Nouvelle réservation
          </CardTitle>
          <p className="text-muted-foreground text-xl mt-2">
            Réservez votre espace de travail idéal en quelques clics
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8 text-lg">
            {/* Type d'espace */}
            <div className="space-y-3">
              <Label htmlFor="spaceType" className="flex items-center gap-3 text-xl font-semibold">
                <MapPin className="h-7 w-7 text-red-700" />
                Type d'espace *
              </Label>
              <Select value={formData.spaceType} onValueChange={(value) =>
                setFormData(prev => ({ ...prev, spaceType: value }))
              }>
                <SelectTrigger className="bg-white/50 border-red-200 focus:border-red-500 text-lg py-3">
                  <SelectValue placeholder="Sélectionnez un type d'espace" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 text-lg">
                  {spaceTypes.map((type) => (
                    <SelectItem key={type} value={type} className="focus:bg-red-50 text-lg py-3">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-3">
              <Label className="flex items-center gap-3 text-xl font-semibold">
                <CalendarIcon className="h-7 w-7 text-red-700" />
                Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/50 border-red-200 focus:border-red-500 text-lg py-3",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-7 w-7" />
                    {date ? format(date, "dd MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-red-200" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horaires */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="startTime" className="flex items-center gap-3 text-xl font-semibold">
                  <Clock className="h-7 w-7 text-red-700" />
                  Heure de début *
                </Label>
                <Select value={formData.startTime} onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, startTime: value }))
                }>
                  <SelectTrigger className="bg-white/50 border-red-200 focus:border-red-500 text-lg py-3">
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200 text-lg">
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time} className="focus:bg-red-50 text-lg py-3">
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="endTime" className="flex items-center gap-3 text-xl font-semibold">
                  <Clock className="h-7 w-7 text-red-700" />
                  Heure de fin *
                </Label>
                <Select value={formData.endTime} onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, endTime: value }))
                }>
                  <SelectTrigger className="bg-white/50 border-red-200 focus:border-red-500 text-lg py-3">
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200 text-lg">
                    {timeSlots
                      .filter(time => !formData.startTime || time > formData.startTime)
                      .map((time) => (
                        <SelectItem key={time} value={time} className="focus:bg-red-50 text-lg py-3">
                          {time}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nombre de participants */}
            <div className="space-y-3">
              <Label htmlFor="attendees" className="flex items-center gap-3 text-xl font-semibold">
                <Users className="h-7 w-7 text-red-700" />
                Nombre de participants
              </Label>
              <Input
                id="attendees"
                type="number"
                min={1}
                max={20}
                placeholder="Ex: 4"
                value={formData.attendees}
                onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                className="bg-white/50 border-red-200 focus:border-red-500 text-lg py-3"
              />
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-xl font-semibold">Notes supplémentaires</Label>
              <Textarea
                id="notes"
                placeholder="Besoins particuliers, équipements requis..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-white/50 min-h-[150px] border-red-200 focus:border-red-500 text-lg p-4"
              />
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              className="w-full gradient-primary hover:scale-105 transition-transform font-semibold py-6 text-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3 justify-center">
                  <div className="animate-spin rounded-full border-2 border-white border-t-transparent h-6 w-6"></div>
                  Confirmation en cours...
                </div>
              ) : (
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="h-6 w-6" />
                  Confirmer la réservation
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
