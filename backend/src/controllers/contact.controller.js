import Contact from "../models/Contact.js";
export const addContact=async(req,res)=>{
    try{
        const { name, phone, relation } = req.body;

    const contact = await Contact.create({
      userId: req.user.id,
      name,
      phone,
      relation,
    });

    res.status(201).json(contact);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}
export const getContacts=async(req,res)=>{
    try{
        const contact=await Contact.find({userId:req.user.id});
        res.json(contacts);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}
export const deleteContact=async(req,res)=>{
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact deleted" });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}