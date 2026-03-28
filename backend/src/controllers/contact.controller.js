import Contact from "../models/Contact.js";
export const addContact=async(req,res)=>{
    try{
        const { name, phone, relation } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ message: "Name and phone required" });
          }
    const contact = await Contact.create({
      userId: req.user._id,
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
        const contacts=await Contact.find({userId:req.user._id});
        res.json(contacts);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}
export const deleteContact = async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.id);
  
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
  
      if (contact.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }
  
      await contact.deleteOne();
  
      res.json({ message: "Contact deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };