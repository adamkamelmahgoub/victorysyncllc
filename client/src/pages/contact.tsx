import { Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertContactSubmissionSchema } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

type ContactFormData = z.infer<typeof insertContactSubmissionSchema>;

export default function Contact() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(insertContactSubmissionSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      await apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Get Started?
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Schedule a demo or contact our team to learn how VictorySync can transform your customer engagement operations.
          </p>
        </div>
      </section>
      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold victory-dark mb-6">Send Us a Message</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="John"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Doe"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input
                      id="company"
                      {...register('company')}
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@company.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      rows={4}
                      placeholder="Tell us about your needs..."
                      className={errors.message ? 'border-red-500' : ''}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-victory-purple hover:bg-purple-700 text-white"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="victory-purple w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold victory-dark">Schedule a Demo</h4>
                      <p className="victory-gray">See our platform in action, just submit a request using this contact form</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="victory-blue w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold victory-dark">Email Us</h4>
                      <p className="victory-gray">info@victorysync.com</p>
                      <p className="text-sm victory-gray">Response within 4 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="text-green-600 w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold victory-dark">Call Us</h4>
                      <p className="victory-gray">+1 (718)-813-2106</p>
                      <p className="text-sm victory-gray">Available 24/7</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="victory-purple w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold victory-dark">Our Location</h4>
                      <p className="victory-gray">Millstone, New Jersey</p>
                      <p className="text-sm victory-gray">EST Time Zone</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-victory text-white">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Ready to Save 60%?</h4>
                  <p className="mb-4 text-purple-100">
                    Join our next webinar to learn how other businesses are cutting costs while improving service.
                  </p>
                  <Button className="text-victory-purple hover:bg-gray-100 bg-[#5268f3]">
                    Register for Webinar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold victory-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl victory-gray">
              Common questions about getting started with VictorySync
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">How quickly can we get started?</h3>
                <p className="victory-gray">
                  We can have your service up and running within 48-72 hours after contract signing. This includes agent training and system integration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">What are your hours of operation?</h3>
                <p className="victory-gray">
                  We offer 24/7 support options. Our Cairo-based team works in shifts to provide coverage that aligns with US business hours and beyond.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">Do you provide training for your agents?</h3>
                <p className="victory-gray">
                  Yes, all our agents undergo comprehensive training on your specific business processes, products, and customer service standards before handling any customer interactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">How do you ensure data security?</h3>
                <p className="victory-gray">
                  We follow enterprise-grade security protocols including encrypted connections, secure data centers, and strict access controls. We're compliant with major industry standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold victory-dark mb-2">Can I monitor agent performance?</h3>
                <p className="victory-gray">
                  Absolutely! We provide real-time dashboards, detailed reports, and regular performance reviews. You'll have full visibility into service metrics and quality scores.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="gradient-victory py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Start the Conversation
          </h2>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Ready to reduce costs and improve customer satisfaction? We're here to help make it happen.
          </p>
          
        </div>
      </section>
    </div>
  );
}
